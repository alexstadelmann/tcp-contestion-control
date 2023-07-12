function resendMissingSegment(isDelivered) {
  const firstUnackedSegmentNum = getLastElem(dynamicServerAndSessionState).firstUnackedSegmentNum

  //Delete all remaining elements from dynamic server array
  dynamicServerSegments = dynamicServerSegments.slice(0,firstUnackedSegmentNum + 1)

  const segmentToRetransmit = dynamicServerSegments[firstUnackedSegmentNum]
  const oldEndMS = segmentToRetransmit.endMS
  const oldSendingCompleteMS = segmentToRetransmit.sendingCompleteMS
  const timeoutSpan = getLastElem(dynamicSettings).timeoutSpan
  const seqSizeByte = getLastElem(dynamicSettings).seqSizeByte
  const transmissionTime = segmentToRetransmit.transmissionTime
  const seqNum = segmentToRetransmit.seqNum

  //On retransmission we assume all segments are succesfully delivered
  dynamicServerSegments[firstUnackedSegmentNum].isDelivered = isDelivered
  dynamicServerSegments[firstUnackedSegmentNum].startMS = oldSendingCompleteMS + timeoutSpan
  dynamicServerSegments[firstUnackedSegmentNum].endMS = oldEndMS + timeoutSpan + transmissionTime
  dynamicServerSegments[firstUnackedSegmentNum].sendingCompleteMS = oldSendingCompleteMS + timeoutSpan + transmissionTime
  dynamicServerSegments[firstUnackedSegmentNum].seqNum = seqNum

  const unacked = getLastElem(dynamicServerAndSessionState).unacked
  setServerState({
    ccState: algorithms.SLOW_START,
    seqNum: seqNum + seqSizeByte,
    unacked: unacked + 1
  })

  //Update clock 
  addToClockMs(seqSizeByte / transrateKBytePerSecond)

  //Delete all pending acks
  dynamicPendingAcks = []

  //If currently all segments are acked, then set the sending end of the new ack to be the timeout timer start
  setTimestampFirstUnacked(dynamicServerSegments[firstUnackedSegmentNum].sendingCompleteMS)

   //If sending this segment fails, it is the "resposibility" of the server to inform the session
   if (!isDelivered) {
    setServerState({
      lastEvent: events.RETRANSMIT_LOSS
    })
  }
  updateDataPanel()

}