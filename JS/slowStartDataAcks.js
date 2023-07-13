function clientSendNewAck(isDelivered) {

  
  //Fetch ack from pending array and also parameters
  const newAck = getLastElem(dynamicPendingAcks)


  //Set property delivered to true or false
  newAck.isDelivered = isDelivered

  //Send new ack by pushing it onto the (realality-emulating) client array
  dynamicClientAcks.push(newAck)

  //If the ack gets lost it is this functions responsibility to tell the session
  if(!isDelivered) {
    setSessionState({
      lastEvent: events.ACK_LOSS
    })
  }
}

function serverReceiveNewAck() {
  const newAck = getLastElem(dynamicPendingAcks)
  const ackNum = newAck.ackNum
  const timeNow = newAck.endMS


  const congWin = getServerState('congWin')
  const currentTraffic = getServerState('currentTraffic')
  const duplicateAcks = getServerState('duplicateAcks')
  let firstUnackedSegmentNum = getServerState('firstUnackedSegmentNum')

  const seqSizeByte = getLastElem(dynamicSettings).seqSizeByte

  setServerState({
    currentTraffic: currentTraffic - 1
  })
  setSessionState({
    lastEvent: events.NEW_ACK,
    clockMS: timeNow,
  })

   //Check is ack is a duplicate
   if(ackNum == getServerState('confirmedReceived')) {
    setSessionState({
      lastEvent: events.DUP_ACK
    })
    if (getServerState('ccState') != algorithms.FAST_RECOVERY) {
      setServerState({
        duplicateAcks: duplicateAcks + 1,
      })
      
      if(getServerState('duplicateAcks') >= 3) {
        trigger3DupplicateAcksEvent()
        return
      }
    } else {
      const congWin = getServerState('congWin')
      setServerState({
        congWin: congWin + 1
      })
    }
    
  } else {
    //Here we know that ack is not duplicate
    switch (getServerState('ccState')) {
      case algorithms.SLOW_START:
        setServerState({
          congWin: congWin + 1,
          confirmedReceived: ackNum,
        })
        //Check if threshold has been reached
        if (getServerState('congWin') >= getServerState('threshold')) {
          triggerThresholdEvent()
          return
        }
        //If the ack acknowledges the first currentTraffic segment send or even a later segment, then update server state
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
        const congWinFractions = getServerState('congWinFractions')
        setServerState({
          congWinFractions: congWinFractions + 1,
          currentTraffic: currentTraffic - 1,
          confirmedReceived: ackNum,
        })
        if(getServerState('congWinFractions') == congWin) {
          setServerState({
            congWin: congWin + 1,
            congWinFractions: 0
          })
        }
        //If the ack acknowledges the first currentTraffic segment send or even a later segment, then update server state
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
      case algorithms.FAST_RECOVERY:
        setServerState({
          ccState: algorithms.CONGESTION_AVOIDANCE,
          congWin: getServerState('threshold'),
          duplicateAcks: 0
        })
        setSessionState({
          lastEvent: events.NEW_ACK,
        })

    }
      
  }
}