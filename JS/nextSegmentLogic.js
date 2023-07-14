function serverSendSegment(isDelivered) {

  //Fetch up to date parameters
  const now = getSessionState('clockMS')
  const seqNum = getServerState('seqNum')
  const currentTraffic = getServerState('currentTraffic')

  const seqSizeByte = getConfigState('seqSizeByte')
  const roundTripTimeMS = getConfigState('roundTripTimeMS')
  const transrateKBytePerSecond = getConfigState('transrateKBytePerSecond')

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
    retransmitted: false,
  }
  serverSegments.push(newSegment)

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
  const roundTripTimeMS = getConfigState('roundTripTimeMS')
  //We know that the segment has arrived
  setSessionState({
    lastEvent: events.SEG
  })
  updateDataPanel()

  //Add new segment to client buffer
  clientBuffer.add(getSegmentAttribute('seqNum'))
  

  //Check if there is a or many segments already in buffer that fit after the received segment
  while (true) {
    if(clientBuffer.has(getClientState('BytesReceivedInOrder'))) {
      setClientState({
        BytesReceivedInOrder: getClientState('BytesReceivedInOrder')
        + getConfigState('seqSizeByte')
      })
    } else {
      break
    }
  }
  
  
  //Create the acknowlegement for the new segment
  const newAck = {
    startMS: getSegmentAttribute('endMS'),
    endMS: getSegmentAttribute('endMS') + roundTripTimeMS / 2,
    ackNum: getClientState('BytesReceivedInOrder'),
    sendingSegmentCompleteMS: getSegmentAttribute('sendingCompleteMS')
  }
  pendingAcks.unshift(newAck)
}

