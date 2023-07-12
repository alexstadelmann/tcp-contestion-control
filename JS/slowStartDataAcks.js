function clientSendNewAck(isDelivered) {

  
  //Fetch ack from pending array and also parameters
  const newAck = getLastElem(dynamicPendingAcks)


  //Set property delivered to true or false
  newAck.isDelivered = isDelivered

  //Send new ack by pushing it onto the (realality-emulating) client array
  dynamicClientAcks.push(newAck)

  //If the ack gets lost it is this functions responsibility to tell the session
  if(!isDelivered) {
    setServerState({
      lastEvent: events.ACK_LOSS
    })
  }
}

function serverReceiveNewAck() {
  const newAck = getLastElem(dynamicPendingAcks)
  const ackNum = newAck.ackNum
  const timeNow = newAck.endMS

  const currentServerState = getLastElem(dynamicServerAndSessionState)

  const congWin = currentServerState.congWin
  const unacked = currentServerState.unacked
  const duplicateAcks = currentServerState.duplicateAcks
  let firstUnackedSegmentNum = currentServerState.firstUnackedSegmentNum

  const seqSizeByte = getLastElem(dynamicSettings).seqSizeByte

  setServerState({
    lastEvent: events.NEW_ACK,
    clockMS: timeNow
  })

   //Check is ack is a duplicate
   if(ackNum == currentServerState.confirmedReceived) {
    setServerState({
      duplicateAcks: duplicateAcks + 1,
    })
    setServerState({
      lastEvent: events.DUP_ACK
    })
    if(getLastElem(dynamicServerAndSessionState).duplicateAcks >= 3) {
      trigger3DupplicateAcksEvent()
      return
    }
  } else {
    //Here we know that ack is not duplicate
    switch (currentServerState.ccState) {
      case algorithms.SLOW_START:
        setServerState({
          congWin: congWin + 1,
          unacked: unacked - 1,
          confirmedReceived: ackNum,
        })
        //Check if threshold has been reached
        if (getLastElem(dynamicServerAndSessionState).congWin >= getLastElem(dynamicServerAndSessionState).threshold) {
          triggerThresholdEvent()
          return
        }
        //If the ack acknowledges the first unacked segment send or even a later segment, then update server state
        if (ackNum >= dynamicServerSegments[firstUnackedSegmentNum].seqNum + seqSizeByte) {
          const numberOfSteps = (ackNum - dynamicServerSegments[firstUnackedSegmentNum].seqNum) /seqSizeByte
          firstUnackedSegmentNum += numberOfSteps
          const timestampFirstUnacked = (dynamicServerSegments.length <= firstUnackedSegmentNum)
            ? NONE
            : dynamicServerSegments[firstUnackedSegmentNum].sendingCompleteMS

          
          setServerState({
            firstUnackedSegmentNum,
            timestampFirstUnacked,
          })
        }

        
        
        break
      case algorithms.CONGESTION_AVOIDANCE:
        const congWinFractions = getLastElem(dynamicServerAndSessionState).congWinFractions
        setServerState({
          congWinFractions: congWinFractions + 1,
          unacked: unacked - 1,
          confirmedReceived: ackNum,
        })
        if(getLastElem(dynamicServerAndSessionState).congWinFractions == congWin) {
          setServerState({
            congWin: congWin + 1,
            congWinFractions: 0
          })
        }
        console.log('congWinFraction', getLastElem(dynamicServerAndSessionState).congWinFractions)
        //If the ack acknowledges the first unacked segment send or even a later segment, then update server state
        if (ackNum >= dynamicServerSegments[firstUnackedSegmentNum].seqNum + seqSizeByte) {
          const numberOfSteps = (ackNum - dynamicServerSegments[firstUnackedSegmentNum].seqNum) /seqSizeByte
          firstUnackedSegmentNum += numberOfSteps
          const timestampFirstUnacked = (dynamicServerSegments.length <= firstUnackedSegmentNum)
            ? NONE
            : dynamicServerSegments[firstUnackedSegmentNum].sendingCompleteMS

          
          setServerState({
            firstUnackedSegmentNum,
            timestampFirstUnacked,
          })
        }
        break

    }
      
  }
}