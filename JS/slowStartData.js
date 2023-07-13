


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
    getLastElem(dynamicServerAndSessionState).congWin > getLastElem(dynamicServerAndSessionState).currentTraffic
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
  const currentSessionState = getLastElem(dynamicServerAndSessionState)
  const currentSettings = getLastElem(dynamicSettings)

  const now = getLastElem(dynamicSessionState).clockMS
  const timestampFirstUnacked = currentSettings.timestampFirstUnacked
  const timeoutSpan = currentSettings.timeoutSpan

  return now - timestampFirstUnacked >= timeoutSpan
}

function checkTimeoutLater() {
  if (dynamicPendingAcks.length == 0) return true

  timeNextAck = getLastElem(dynamicPendingAcks).endMS

  const currentServerState = getLastElem(dynamicServerAndSessionState)

  const timestampFirstUnacked = currentServerState.timestampFirstUnacked
  const timeoutSpan = currentServerState.timeoutSpan

  return timeNextAck - timestampFirstUnacked >= timeoutSpan
}





function setClock(time) {
  const newEntry = { ...getLastElem(dynamicSessionState) }
  newEntry.clockMS = time
  dynamicServerAndSessionState.push(newEntry)
}

function isPendingAck() {
  if (dynamicPendingAcks.length == 0) return false
  const timeNextAck = getLastElem(dynamicPendingAcks).endMS
  return timeNextAck == getLastElem(dynamicSessionState).clockMS
}

function setTimestampFirstUnacked(time) {
  const newEntry = { ...getLastElem(dynamicServerAndSessionState) }
  newEntry.timestampFirstUnacked = time
  dynamicServerAndSessionState.push(newEntry)
}




