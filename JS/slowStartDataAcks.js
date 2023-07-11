function makeNewAck(isDelivered) {

  //To do
  if(!isDelivered) return

  //Fetch ack from pending array and also parameters
  const newAck = getLastElem(dynamicPendingAcks)
  const ackNum = newAck.ackNum
  const timeNow = newAck.endMS
  const currentServerState = getLastElem(dynamicServerState)

  const congWin = currentServerState.congWin
  const unacked = currentServerState.unacked
  let firstUnackedSegmentNum = currentServerState.firstUnackedSegmentNum

  const seqSizeByte = getLastElem(dynamicSettings).seqSizeByte

  //Make new ack by pushing it onto the client array
  dynamicClientAcks.push(newAck)
  
  
  
  //Update time
  setClock(timeNow)

  //Update server state to reflect receiving an ack
  setServerState({
    congWin: congWin + 1,
    unacked: unacked - 1,
    confirmedReceived: ackNum,

  })
  //If the ack acknowledges the first unacked segment send, then update server state
  if (ackNum == dynamicServerSegments[firstUnackedSegmentNum].seqNum + seqSizeByte) {
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