'use strict'
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#TCP_message').addEventListener('click', () => {
    establishTCP()
  })
})

function establishTCP() {
  if (dynamic_server_state[0].tcp_state == 'CLOSED') {
    setNewEntryServer('tcp_state', 'LISTEN')
  } else if (dynamic_server_state[0].tcp_state == 'LISTEN') {
    clientSendSYN()
    setNewEntryServer('tcp_state', 'SYN_RECEIVED')
  } else if (dynamic_server_state[0].tcp_state == 'SYN_RECEIVED' && dynamic_server_state[0].unacked == 0) {
    serverSendSYNACK()
    setNewEntryServer('unacked', 1)
    setNewEntryServer('seq_num', 1)
  } else {
    clientSendACK()
    setNewEntryServer('tcp_state', 'ESTABLISHED')
    setNewEntryServer('unacked', 0)
  }
  
  notify()
  return
}

function setNewEntryServer(key, newValue) {
  const new_entry = {...dynamic_server_state[0]}
  new_entry[key] = newValue
  dynamic_server_state.unshift(new_entry)
  return
}

function notify() {
  update_data_panel()
  return
}

function clientSendSYN() {

  const new_entry = {
    timestamp: 0,
    delivery_time: (dynamic_settings[0].rtt_ms / 2),
    flag: 'SYN',
    ack_num: 0
  }
  dynamic_clientside_packets.unshift(new_entry)
  return
}

function serverSendSYNACK() {
  const now = dynamic_clientside_packets[0].delivery_time
  const new_entry = {
    timestamp: now,
    delivery_time: now + (dynamic_settings[0].rtt_ms / 2),
    flag: 'SYN_ACK',
    ack_num: 1
  }
  dynamic_serverside_packets.unshift(new_entry)
  return
}

function clientSendACK() {
  const now = dynamic_serverside_packets[0].delivery_time
  const new_entry = {
    timestamp: now,
    delivery_time: now + (dynamic_settings[0].rtt_ms / 2),
    flag: 'ACK',
    ack_num: 1
  }

  dynamic_clientside_packets.unshift(new_entry)
}