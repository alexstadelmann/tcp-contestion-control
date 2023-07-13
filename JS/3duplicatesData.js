function resendMissingSegment3Dup(isDelivered) {
  const firstUnackedSegmentNum = getServerState('firstUnackedSegmentNum')


  //Delete all remaining elements from dynamic server array
  dynamicServerSegments = dynamicServerSegments.slice(0,firstUnackedSegmentNum + 1)

  const segmentToRetransmit = dynamicServerSegments[firstUnackedSegmentNum]
  const transmissionTime = segmentToRetransmit.transmissionTime
  const timeNow = getSessionState('clockMS')
  const seqSizeByte = getLastElem(dynamicSettings).seqSizeByte
  const roundTripTimeMS = getLastElem(dynamicSettings).roundTripTimeMS

 

  //Adapt segment that is already in array
  dynamicServerSegments[firstUnackedSegmentNum].isDelivered = isDelivered
  dynamicServerSegments[firstUnackedSegmentNum].startMS = timeNow
  dynamicServerSegments[firstUnackedSegmentNum].endMS = timeNow + transmissionTime + roundTripTimeMS / 2
  dynamicServerSegments[firstUnackedSegmentNum].sendingCompleteMS = timeNow + transmissionTime
  dynamicServerSegments[firstUnackedSegmentNum].retransmitted = true
  setServerState({
    ccState: algorithms.FAST_RECOVERY,
    seqNum: dynamicServerSegments[firstUnackedSegmentNum].seqNum + seqSizeByte,
    currentTraffic: currentTraffic + 1
  })

  //Update clock 
  addToClockMs(seqSizeByte / transrateKBytePerSecond)


  //If currently all segments are acked, then set the sending end of the new ack to be the timeout timer start
  setTimestampFirstUnacked(dynamicServerSegments[firstUnackedSegmentNum].sendingCompleteMS)

   //If sending this segment fails, it is the "resposibility" of the server to inform the session
   if (!isDelivered) {
    setSessionState({
      lastEvent: events.RETRANSMIT_LOSS
    })
  }
  updateDataPanel()

}

  