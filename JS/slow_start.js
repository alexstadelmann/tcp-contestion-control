'use strict'
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#send').addEventListener('click', () => {
    sendSlowStart()
  })
})

function sendSlowStart() {

  if (isPendingAck()){
    receiveAck()
  } else if (dynamic_server_state.at(-1).cong_win > dynamic_server_state.at(-1).unacked) {
      sendNewSegment()
  } else {
      receiveAck()
  }
  notify()
}




function receiveAck() {
  const newAck = dynamic_pending_acks.pop()
  const cong_win = dynamic_server_state.at(-1).cong_win
  const unacked = dynamic_server_state.at(-1).unacked
  dynamic_clientside_packets.push(newAck)
  console.log(newAck)
  setClock(newAck.end_ms)
  setServerState({'cong_win': cong_win + 1, 'unacked': unacked - 1})
  return
}

function setClock(time) {
  const newEntry = {...dynamic_server_state.at(-1)}
  newEntry.clock_ms = time
  dynamic_server_state.push(newEntry)
  return
}

function isPendingAck() {
  if (dynamic_pending_acks.length == 0) {
    return false
  }
  const timeNextAck = dynamic_pending_acks.at(-1).end_ms
  return timeNextAck == dynamic_server_state.at(-1).clock_ms
}


function sendNewSegment() {

  //Fetch up to date variables
  const now = dynamic_server_state.at(-1).clock_ms
  const seqsize_byte = dynamic_settings.at(-1).seqsize_byte
  const seq_num = dynamic_server_state.at(-1).seq_num
  const rtt_ms = dynamic_settings.at(-1).rtt_ms
  const transrate_kbyte_per_second = dynamic_settings.at(-1).transrate_kbyte_per_second
  const delay_ms = (seqsize_byte / transrate_kbyte_per_second) + (rtt_ms/2)
  const unacked = dynamic_server_state.at(-1).unacked
  const cong_win = dynamic_server_state.at(-1).cong_win

  //Create new segment
    const newSegment = {
    start_ms: now,
    end_ms: now + delay_ms,
    sequence_number: seq_num,
  }

  console.log('Server:', newSegment)
  dynamic_serverside_packets.push(newSegment)
  addToClockMs(seqsize_byte /transrate_kbyte_per_second)
  setServerState({'seq_number': seq_num + seqsize_byte, 'unacked': unacked + 1})
  //Create the acknowlegement for the new segment
  const newAck = {
    start_ms: newSegment.end_ms,
    end_ms: newSegment.end_ms + rtt_ms/2,
    ack_num: seq_num + seqsize_byte
  }
  dynamic_pending_acks.unshift(newAck)
  return
}