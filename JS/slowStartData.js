document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#send').addEventListener('click',()=> {
    sendSlowStart(true)
  })
  document.querySelector('#loss').addEventListener('click', ()=> {
    sendSlowStart(false)
  })
})




function sendSlowStart(isDelivered) {
  if (checkTimeoutNow()) triggerTimeout()

  if (isPendingAck()) {
    makeNewAck(isDelivered)
    displayNewAck()
  } else if (
    getLastElem(dynamicServerState).congWin > getLastElem(dynamicServerState).unacked
  ) {
    makeNewSegment(isDelivered)
    displayNewSegment()
    displayTimeoutBar()
  } else {

    if (checkTimeoutLater()) triggerTimeout()
    makeNewAck(isDelivered)
    displayNewAck()
  }
  updateDataPanel()
  
  console.log('serverState', getLastElem(dynamicServerState))
  console.log('clientState', getLastElem(dynamicClientState))
  console.log('serversidePackets', dynamicServerSegments)
}

function checkTimeoutNow() {
  const currentSettings = getLastElem(dynamicSettings)

  const now = currentSettings.clockMS
  const timestampLastAcked = currentSettings.timestampLastAcked
  const timeoutSpan = currentSettings.timeoutSpan

  return now - timestampLastAcked >= timeoutSpan
}

function checkTimeoutLater() {
  if (dynamicPendingAcks.length == 0) return true

  timeNextAck = getLastElem(dynamicPendingAcks).endMS

  const currentServerState = getLastElem(dynamicServerState)

  const timestampLastAcked = currentServerState.timestampLastAcked
  const timeoutSpan = currentServerState.timeoutSpan

  return timeNextAck - timestampLastAcked >= timeoutSpan
}





function setClock(time) {
  const newEntry = { ...getLastElem(dynamicServerState) }
  newEntry.clockMS = time
  dynamicServerState.push(newEntry)
}

function isPendingAck() {
  if (dynamicPendingAcks.length == 0) return false
  const timeNextAck = getLastElem(dynamicPendingAcks).endMS
  return timeNextAck == getLastElem(dynamicServerState).clockMS
}

function setTimestampFirstUnacked(time) {
  const newEntry = { ...getLastElem(dynamicServerState) }
  newEntry.timestampFirstUnacked = time
  dynamicServerState.push(newEntry)
}




