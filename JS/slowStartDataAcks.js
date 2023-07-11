function makeNewAck(isDelivered) {

  
  //Fetch ack from pending array and also parameters
  const newAck = getLastElem(dynamicPendingAcks)

  
  const ackNum = newAck.ackNum
  const timeNow = newAck.endMS
  const currentServerState = getLastElem(dynamicServerState)

  const congWin = currentServerState.congWin
  const unacked = currentServerState.unacked
  let firstUnackedSegmentNum = currentServerState.firstUnackedSegmentNum

  const seqSizeByte = getLastElem(dynamicSettings).seqSizeByte

  //Set property delivered to true or false
  newAck.isDelivered = isDelivered

  //Make new ack by pushing it onto the client array
  dynamicClientAcks.push(newAck)

  //Update data_panel
  if (isDelivered) {
    setServerState({
      lastEvent: events.NEW_ACK
    })
  } else {
    setServerState({
      lastEvent: events.ACK_LOSS
    })
  }
  
  
  
  //Update time
  setClock(timeNow)

  //Update server state to reflect receiving an ack if delivery succesful
  if (!isDelivered) return
  setServerState({
    congWin: congWin + 1,
    unacked: unacked - 1,
    confirmedReceived: ackNum,

  })
  //If the ack acknowledges the first unacked segment send or even a later segment, then update server state
  if (ackNum >= dynamicServerSegments[firstUnackedSegmentNum].seqNum + seqSizeByte) {
    firstUnackedSegmentNum += 1
    const timestampFirstUnacked = (dynamicServerSegments.length <= firstUnackedSegmentNum)
      ? NONE
      : dynamicServerSegments[firstUnackedSegmentNum].sendingCompleteMS

    
    setServerState({
      firstUnackedSegmentNum,
      timestampFirstUnacked,
    })

  }
}