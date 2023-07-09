"use strict"

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#send").addEventListener("click", sendSlowStart)
})

function sendSlowStart() {
  // same as default
  if (isPendingAck()) {
    receiveAck()
    displayNewAck()
  } else if (dynamicServerState.at(-1).cong_win > dynamicServerState.at(-1).unacked) {
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
  const cong_win = dynamicServerState.at(-1).cong_win
  const unacked = dynamicServerState.at(-1).unacked
  dynamicClientsidePackets.push(newAck)
  console.log(newAck)
  setClock(newAck.end_ms)
  setServerState({
    'cong_win': cong_win + 1,
    'unacked': unacked - 1
  })
}

function setClock(time) {
  const newEntry = {...dynamicServerState.at(-1)}
  newEntry.clock_ms = time
  dynamicServerState.push(newEntry)
}

function isPendingAck() {
  if (dynamicPendingAcks.length == 0) return false
  const timeNextAck = dynamicPendingAcks.at(-1).end_ms
  return timeNextAck == dynamicServerState.at(-1).clock_ms
}

function sendNewSegment() {
  const now = dynamicServerState.at(-1).clock_ms
  const seqsize_byte = dynamicSettings.at(-1).seqsize_byte
  const seq_num = dynamicServerState.at(-1).seq_num
  const rtt_ms = dynamicSettings.at(-1).rtt_ms
  const transrate_kbyte_per_second = dynamicSettings.at(-1).transrate_kbyte_per_second
  const delay_ms = (seqsize_byte / transrate_kbyte_per_second) + (rtt_ms/2)
  const unacked = dynamicServerState.at(-1).unacked

  const newSegment = {
    start_ms: now,
    end_ms: now + delay_ms,
    sequence_number: seq_num,
  }

  dynamicServersidePackets.push(newSegment)
  addToClockMs(seqsize_byte / transrate_kbyte_per_second)
  setServerState({
    "seq_num": seq_num + seqsize_byte,
    "unacked": unacked + 1
  })

  //Create the acknowlegement for the new segment
  const newAck = {
    start_ms: newSegment.end_ms,
    end_ms: newSegment.end_ms + rtt_ms / 2,
    ack_num: seq_num + seqsize_byte
  }

  dynamicPendingAcks.unshift(newAck)
}
