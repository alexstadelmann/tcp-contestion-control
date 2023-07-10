"use strict"

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#send").addEventListener("click", sendSlowStart)
})

function sendSlowStart() {
  // same as default
  if (isPendingAck()) {
    receiveAck()
    displayNewAck()
  } else if (dynamicServerState.at(-1).congWin > dynamicServerState.at(-1).unacked) {
    sendNewSegment()
    displayNewSegment()
  } else {
    receiveAck()
    displayNewAck()
  }

  notify()
}

function receiveAck() {
  const newAck = dynamicPendingAcks.at(-1)
  const congWin = dynamicServerState.at(-1).congWin
  const unacked = dynamicServerState.at(-1).unacked
  dynamicClientsidePackets.push(newAck)
  setClock(newAck.endMS)
  setServerState({
    'congWin': congWin + 1,
    'unacked': unacked - 1
  })
}

function setClock(time) {
  const newEntry = {...dynamicServerState.at(-1)}
  newEntry.clockMS = time
  dynamicServerState.push(newEntry)
}

function isPendingAck() {
  if (dynamicPendingAcks.length == 0) return false
  const timeNextAck = dynamicPendingAcks.at(-1).endMS
  return timeNextAck == dynamicServerState.at(-1).clockMS
}

function sendNewSegment() {
  const now = dynamicServerState.at(-1).clockMS
  const seqSizeByte = dynamicSettings.at(-1).seqSizeByte
  const seqNum = dynamicServerState.at(-1).seqNum
  const roundTripTimeMS = dynamicSettings.at(-1).roundTripTimeMS
  const transrateKBytePerSecond = dynamicSettings.at(-1).transrateKBytePerSecond
  const delayMs = (seqSizeByte / transrateKBytePerSecond) + (roundTripTimeMS/2)
  const unacked = dynamicServerState.at(-1).unacked

  const newSegment = {
    startMS: now,
    endMS: now + delayMs,
    seqNum: seqNum,
  }

  dynamicServersidePackets.push(newSegment)
  addToClockMs(seqSizeByte / transrateKBytePerSecond)
  setServerState({
    "seqNum": seqNum + seqSizeByte,
    "unacked": unacked + 1
  })

  //Create the acknowlegement for the new segment
  const newAck = {
    startMS: newSegment.endMS,
    endMS: newSegment.endMS + roundTripTimeMS / 2,
    ackNum: seqNum + seqSizeByte
  }

  dynamicPendingAcks.unshift(newAck)
}
