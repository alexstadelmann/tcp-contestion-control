document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#send').addEventListener('click', sendSlowStart)
})

function sendSlowStart() {
  // same as default
  if (isPendingAck()) {
    receiveAck()
    displayNewAck()
  } else if (
    getLastElem(dynamicServerState).congWin > getLastElem(dynamicServerState).unacked
  ) {
    sendNewSegment()
    displayNewSegment()
  } else {
    receiveAck()
    displayNewAck()
  }

  notify()
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

function sendNewSegment() {
  const now = getLastElem(dynamicServerState).clockMS
  const seqSizeByte = getLastElem(dynamicSettings).seqSizeByte
  const seqNum = getLastElem(dynamicServerState).seqNum
  const roundTripTimeMS = getLastElem(dynamicSettings).roundTripTimeMS
  const transrateKBytePerSecond = getLastElem(dynamicSettings).transrateKBytePerSecond
  const delayMs = seqSizeByte / transrateKBytePerSecond + roundTripTimeMS / 2
  const unacked = getLastElem(dynamicServerState).unacked

  const newSegment = {
    startMS: now,
    endMS: now + delayMs,
    seqNum: seqNum,
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
  }

  dynamicPendingAcks.unshift(newAck)
}
