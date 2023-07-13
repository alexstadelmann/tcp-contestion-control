


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
  const timeoutSpan = getServerState('timeoutSpan')

  return now - timestampFirstUnacked >= timeoutSpan
}

function checkTimeoutLater() {
  if (dynamicPendingAcks.length == 0) return true

  timeNextAck = getLastElem(dynamicPendingAcks).endMS


  const timestampFirstUnacked = getServerState('timestampFirstUnacked')
  const timeoutSpan = getServerState('timeoutSpan')

  return timeNextAck - timestampFirstUnacked >= timeoutSpan
}





function setClock(time) {
  const newEntry = { ...getLastElem(dynamicSessionState) }
  newEntry.clockMS = time
  dynamicServerState.push(newEntry)
}

function isPendingAck() {
  if (dynamicPendingAcks.length == 0) return false
  const timeNextAck = getLastElem(dynamicPendingAcks).endMS
  return timeNextAck == getSessionState('clockMS')
}

function setTimestampFirstUnacked(time) {
  const newEntry = { ...getLastElem(dynamicServerState) }
  newEntry.timestampFirstUnacked = time
  dynamicServerState.push(newEntry)
}




