


function sendSlowStart(isDelivered) {
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
    getLastElem(dynamicServerState).congWin > getLastElem(dynamicServerState).unacked
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
  const currentSessionState = getLastElem(dynamicSessionState)
  const currentSettings = getLastElem(dynamicSettings)

  const now = currentSessionState.clockMS
  const timestampFirstUnacked = currentSettings.timestampFirstUnacked
  const timeoutSpan = currentSettings.timeoutSpan

  return now - timestampFirstUnacked >= timeoutSpan
}

function checkTimeoutLater() {
  if (dynamicPendingAcks.length == 0) return true

  timeNextAck = getLastElem(dynamicPendingAcks).endMS

  const currentServerState = getLastElem(dynamicServerState)

  const timestampFirstUnacked = currentServerState.timestampFirstUnacked
  const timeoutSpan = currentServerState.timeoutSpan

  return timeNextAck - timestampFirstUnacked >= timeoutSpan
}





function setClock(time) {
  const newEntry = { ...getLastElem(dynamicSessionState) }
  newEntry.clockMS = time
  dynamicSessionState.push(newEntry)
}

function isPendingAck() {
  if (dynamicPendingAcks.length == 0) return false
  const timeNextAck = getLastElem(dynamicPendingAcks).endMS
  return timeNextAck == getLastElem(dynamicSessionState).clockMS
}

function setTimestampFirstUnacked(time) {
  const newEntry = { ...getLastElem(dynamicServerState) }
  newEntry.timestampFirstUnacked = time
  dynamicServerState.push(newEntry)
}




