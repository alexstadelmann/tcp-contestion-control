function makeNewSegment(isDelivered) {

  //Fetch up to date parameters
  const currentServerState = getLastElem(dynamicServerState)
  const now = currentServerState.clockMS
  const seqNum = currentServerState.seqNum
  const unacked = currentServerState.unacked

  const currentSettings = getLastElem(dynamicSettings)
  const seqSizeByte = currentSettings.seqSizeByte
  const roundTripTimeMS = currentSettings.roundTripTimeMS
  const transrateKBytePerSecond = currentSettings.transrateKBytePerSecond

  //Compute new parameters
  const sendingCompleteMS = now + seqSizeByte / transrateKBytePerSecond
  const delayMS = seqSizeByte / transrateKBytePerSecond + roundTripTimeMS / 2
  
  //Make new segment
  const newSegment = {
    startMS: now,
    endMS: now + delayMS,
    sendingCompleteMS,
    seqNum,
    isDelivered,
  }
  dynamicServerSegments.push(newSegment)
  //Update data_panel
  if (isDelivered) {
    setServerState({
      lastEvent: events.SEG
    })
  } else {
    setServerState({
      lastEvent: events.SEG_LOSS
    })
  }
  //If currently all segments are acked, then set the end of sending the new ack to be the timer start
  if (currentServerState.timestampFirstUnacked == NONE) {
    setTimestampFirstUnacked(sendingCompleteMS)
  }

  //Update clock 
  addToClockMs(seqSizeByte / transrateKBytePerSecond)

  //Update the client state to reflect the arrival of a in order segment
  if (newSegment.isDelivered && getLastElem(dynamicClientState).segmentsReceivedInOrder == seqNum) {
    setClientState({
      segmentsReceivedInOrder: seqNum + seqSizeByte
    })
  }

  //Update server state to reflect sending a new segment
  setServerState({
    seqNum: seqNum + seqSizeByte,
    unacked: unacked + 1,
  })
  
  if (!isDelivered) return
  //Create the acknowlegement for the new segment
  const newAck = {
    startMS: newSegment.endMS,
    endMS: newSegment.endMS + roundTripTimeMS / 2,
    ackNum: getLastElem(dynamicClientState).segmentsReceivedInOrder,
    sendingSegmentCompleteMS: newSegment.sendingCompleteMS
  }
  dynamicPendingAcks.unshift(newAck)
}