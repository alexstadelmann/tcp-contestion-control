document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#send').addEventListener('click', sendSlowStart)
  document.querySelector('#loss').addEventListener('click', sendPacketLoss)
})

function sendPacketLoss() {

}

function sendSlowStart() {
  if (checkTimeoutNow()) {
    triggerTimeout()
    return
  } 
  if (isPendingAck()) {
    receiveAck()
    displayNewAck()
  } else if (
    getLastElem(dynamicServerState).congWin > getLastElem(dynamicServerState).unacked
  ) {
    sendNewSegment()
    displayNewSegment()
  } else {
    if (checkTimeoutBeforeNextAck()) {
      triggerTimeout()
      return
    } 
    receiveAck()
    displayNewAck()
  }
  updateDataPanel()
  displayTimeoutBar()
}

function checkTimeoutNow() {
  const now = getLastElem(dynamicSettings).clockMS
  const timestampLastAcked = getLastElem(dynamicSettings).timestampLastAcked
  const timeoutSpan = getLastElem(dynamicSettings).timeoutSpan
  return now - timestampLastAcked >= timeoutSpan
}

function checkTimeoutBeforeNextAck() {
  const timeNextAck = getLastElem(dynamicPendingAcks).endMS 
  const timestampLastAcked = getLastElem(dynamicSettings).timestampLastAcked
  const timeoutSpan = getLastElem(dynamicSettings).timeoutSpan
  return timeNextAck - timestampLastAcked >= timeoutSpan
}

function receiveAck() {
  const newAck = getLastElem(dynamicPendingAcks)
  const congWin = getLastElem(dynamicServerState).congWin
  const unacked = getLastElem(dynamicServerState).unacked
  dynamicClientsidePackets.push(newAck)
  setClock(newAck.endMS)
  
  setServerState({
    congWin: congWin + 1,
    unacked: unacked - 1,
  })

  if (dynamicPendingAcks.length == 1) {
    console.log(dynamicPendingAcks)
    setTimestampFirstUnacked(-1)
  } else {
    setTimestampFirstUnacked(dynamicPendingAcks.at(-2).sendingSegmentCompleteMS)
  }
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
  console.log('timestampFirstUnacked', newEntry.timestampFirstUnacked)
}

function sendNewSegment() {
  const now = getLastElem(dynamicServerState).clockMS
  const seqSizeByte = getLastElem(dynamicSettings).seqSizeByte
  const seqNum = getLastElem(dynamicServerState).seqNum
  const roundTripTimeMS = getLastElem(dynamicSettings).roundTripTimeMS
  const transrateKBytePerSecond = getLastElem(dynamicSettings).transrateKBytePerSecond
  const sendingCompleteMS = now + seqSizeByte / transrateKBytePerSecond
  const delayMS = seqSizeByte / transrateKBytePerSecond + roundTripTimeMS / 2
  const unacked = getLastElem(dynamicServerState).unacked

  const newSegment = {
    startMS: now,
    endMS: now + delayMS,
    sendingCompleteMS:sendingCompleteMS,
    seqNum: seqNum,
  }

  if (getLastElem(dynamicServerState).timestampFirstUnacked == -1) {
    setTimestampFirstUnacked(sendingCompleteMS)
  }

  dynamicServersidePackets.push(newSegment)
  addToClockMs(seqSizeByte / transrateKBytePerSecond)
  setServerState({
    seqNum: seqNum + seqSizeByte,
    unacked: unacked + 1,
  })

  //Create the acknowlegement for the new segment
  const newAck = {
    startMS: newSegment.endMS,
    endMS: newSegment.endMS + roundTripTimeMS / 2,
    ackNum: seqNum + seqSizeByte,
    sendingSegmentCompleteMS: newSegment.sendingCompleteMS
  }

  dynamicPendingAcks.unshift(newAck)
}
