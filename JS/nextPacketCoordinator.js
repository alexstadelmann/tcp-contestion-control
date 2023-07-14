


function nextPacket(isDelivered) {
  if (checkTimeoutNow()) {
    triggerTimeout()
    displayTimeout()
    return
  }

  if (isPendingAck()) {
    clientSendNewAck(isDelivered)
    if(isDelivered) serverReceiveNewAck()
    displayNewAck()
  } else if (
    getServerState('congWin') > getServerState('currentTraffic')
  ) {
    serverSendSegment(isDelivered)
    if (isDelivered) clientReceiveSegment()
    displayNewSegment()
    
  } else {

    if (checkTimeoutLater()) {
      displayTimeout()
      triggerTimeout()
      return
    }
    clientSendNewAck(isDelivered)
    if(isDelivered) serverReceiveNewAck()
    displayNewAck()
  }
  displayFirstUnAckedBar()
  updateDataPanel()
  
}

function checkTimeoutNow() {

  const now = getSessionState('clockMS')
  const timestampFirstUnacked = getServerState('timestampFirstUnacked')
  const timeoutSpan = getServerState('timeoutSpan') * getConfigState('roundTripTimeMS')

  return now - timestampFirstUnacked >= timeoutSpan
}

function checkTimeoutLater() {
  if (pendingAcks.length == 0) return true

  timeNextAck = getLastElem(pendingAcks).endMS


  const timestampFirstUnacked = getServerState('timestampFirstUnacked')
  const timeoutSpan = getServerState('timeoutSpan') * getConfigState('roundTripTimeMS')

  return timeNextAck - timestampFirstUnacked >= timeoutSpan
}





function setClock(time) {
  const newEntry = { ...getLastElem(sessionState) }
  newEntry.clockMS = time
  serverState.push(newEntry)
}

function isPendingAck() {
  if (pendingAcks.length == 0) return false
  const timeNextAck = getLastElem(pendingAcks).endMS
  return timeNextAck == getSessionState('clockMS')
}

function setTimestampFirstUnacked(time) {
  const newEntry = { ...getLastElem(serverState) }
  newEntry.timestampFirstUnacked = time
  serverState.push(newEntry)
}




