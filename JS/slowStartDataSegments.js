function serverSendSegment(isDelivered) {

  //Fetch up to date parameters
  const now = getSessionState('clockMS')
  const seqNum = getServerState('seqNum')
  const currentTraffic = getServerState('currentTraffic')

  const currentSettings = getLastElem(dynamicSettings)
  const seqSizeByte = currentSettings.seqSizeByte
  const roundTripTimeMS = currentSettings.roundTripTimeMS
  const transrateKBytePerSecond = currentSettings.transrateKBytePerSecond

  //Compute new parameters
  const sendingCompleteMS = now + seqSizeByte / transrateKBytePerSecond
  const delayMS = seqSizeByte / transrateKBytePerSecond + roundTripTimeMS / 2
  const transmissionTime = seqSizeByte / transrateKBytePerSecond


  //Update clock 
  addToClockMs(seqSizeByte / transrateKBytePerSecond)
  
  //Make new segment
  const newSegment = {
    startMS: now,
    endMS: now + delayMS,
    sendingCompleteMS,
    seqNum,
    isDelivered,
    transmissionTime,
  }
  dynamicServerSegments.push(newSegment)

  //Update server state to reflect sending a new segment
  setServerState({
    seqNum: seqNum + seqSizeByte,
    currentTraffic: currentTraffic + 1,
  })

  //If currently all segments are acked, then set the sending end of the new ack to be the timeout timer start
  if (getServerState('timestampFirstUnacked') == NONE) {
    setTimestampFirstUnacked(sendingCompleteMS)
  }

  //If sending this segment fails, it is the "resposibility" of the server to inform the session
  if (!isDelivered) {
    setSessionState({
      lastEvent: events.SEG_LOSS
    })
  }
}

function clientReceiveSegment() {
  const newSegment = getLastElem(dynamicServerSegments)
  const seqNum = newSegment.seqNum
  const seqSizeByte = getLastElem(dynamicSettings).seqSizeByte
  const roundTripTimeMS = getLastElem(dynamicSettings).roundTripTimeMS
  //We know that the segment has arrived
  setSessionState({
    lastEvent: events.SEG
  })
  updateDataPanel()

  //Check that segmentsReceivedInOrder is not bigger than seqNum.If so reduce the former
  if (getClientState('segmentsReceivedInOrder') > getLastElem(dynamicServerSegments).seqNum) {
    setClientState({
      segmentsReceivedInOrder: getLastElem(dynamicServerSegments).seqNum + seqSizeByte
    })
  }
  //Update the client state to reflect the arrival of a in order segment
  if (getClientState('segmentsReceivedInOrder') == getLastElem(dynamicServerSegments).seqNum) {
    setClientState({
      segmentsReceivedInOrder: seqNum + seqSizeByte
    })
  }
  //Create the acknowlegement for the new segment
  const newAck = {
    startMS: newSegment.endMS,
    endMS: newSegment.endMS + roundTripTimeMS / 2,
    ackNum: getClientState('segmentsReceivedInOrder'),
    sendingSegmentCompleteMS: newSegment.sendingCompleteMS
  }
  dynamicPendingAcks.unshift(newAck)
}

