function resendMissingSegment(isDelivered) {
  const firstUnackedSegmentNum = getServerState('firstUnackedSegmentNum')


  const lostSegment = dynamicServerSegments[firstUnackedSegmentNum]
  

  const retransmissionSegment = {
    isDelivered,
    startMS: lostSegment.sendingCompleteMS
      + getConfigState('timeoutSpan'),
    endMS: lostSegment.endMS
      + getConfigState('timeoutSpan')
      + lostSegment.transmissionTime,
    sendingCompleteMS: lostSegment.sendingCompleteMS
      + getConfigState('timeoutSpan')
      + lostSegment.transmissionTime,
    seqNum: lostSegment.seqNum,
    retransmitted: true,
    transmissionTime: lostSegment.transmissionTime
  }
  dynamicServerSegments.push(retransmissionSegment)

  setServerState({
    ccState: algorithms.SLOW_START,
    currentTraffic: getServerState('currentTraffic') + 1,
    firstUnackedSegmentNum: firstUnackedSegmentNum + 1
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