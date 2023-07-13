function resendMissingSegment(isDelivered) {
  const firstUnackedSegmentNum = getServerState('firstUnackedSegmentNum')

  // //Delete all remaining elements from dynamic server array
  // dynamicServerSegments = dynamicServerSegments.slice(0,firstUnackedSegmentNum + 1)

  const lostSegment = dynamicServerSegments[firstUnackedSegmentNum]
  // const oldEndMS = lostSegment.endMS
  // const oldSendingCompleteMS = lostSegment.sendingCompleteMS
  // const timeoutSpan = getLastElem(dynamicSettings).timeoutSpan
  // const seqSizeByte = getLastElem(dynamicSettings).seqSizeByte
  // const transmissionTime = lostSegment.transmissionTime
  // const seqNum = lostSegment.seqNum

  // dynamicServerSegments[firstUnackedSegmentNum].isDelivered = isDelivered
  // dynamicServerSegments[firstUnackedSegmentNum].startMS = oldSendingCompleteMS + timeoutSpan
  // dynamicServerSegments[firstUnackedSegmentNum].endMS = oldEndMS + timeoutSpan + transmissionTime
  // dynamicServerSegments[firstUnackedSegmentNum].sendingCompleteMS = oldSendingCompleteMS + timeoutSpan + transmissionTime
  // dynamicServerSegments[firstUnackedSegmentNum].seqNum = seqNum
  // dynamicServerSegments[firstUnackedSegmentNum].retransmitted = true

  const retransmissionSegment = {
    isDelivered,
    startMS: lostSegment.sendingCompleteMS
      + getLastElem(dynamicSettings).timeoutSpan,
    endMS: lostSegment.endMS
      + getLastElem(dynamicSettings).timeoutSpan
      + lostSegment.transmissionTime,
    sendingCompleteMS: lostSegment.sendingCompleteMS
      + getLastElem(dynamicSettings).timeoutSpan
      + lostSegment.transmissionTime,
    seqNum: lostSegment.seqNum,
    retransmitted: true,
    transmissionTime: lostSegment.transmissionTime
  }
  dynamicServerSegments.push(retransmissionSegment)

  setServerState({
    ccState: algorithms.SLOW_START,
    seqNum: lostSegment.seqNum + getLastElem(dynamicSettings).seqSizeByte,
    currentTraffic: getServerState('currentTraffic') + 1,
    firstUnackedSegmentNum: dynamicServerSegments.length - 1,
  })

  //Update clock 
  addToClockMs(lostSegment.transmissionTime)

  

  //If currently all segments are acked, then set the sending end of the new ack to be the timeout timer start
  setTimestampFirstUnacked(getSegmentAttribute('sendingCompleteMS'))

   //If sending this segment fails, it is the "resposibility" of the server to inform the session
   if (!isDelivered) {
    setSessionState({
      lastEvent: events.RETRANSMIT_LOSS
    })
  }
  updateDataPanel()
  displayFirstUnAckedBar()

}