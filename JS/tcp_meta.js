'use strict'
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#TCP_message').addEventListener('click', () => {
    establishTCP()
  })
})

function establishTCP() {
  console.log(dynamic_server_state.at(-1))
  if (dynamic_server_state.at(-1).tcp_state == 'CLOSED') {
    setNewEntryServer('tcp_state', 'LISTEN')
  } else if (dynamic_server_state.at(-1).tcp_state == 'LISTEN') {
    clientSendSYN()
    setNewEntryServer('tcp_state', 'SYN_RECEIVED')
  } else if (dynamic_server_state.at(-1).tcp_state == 'SYN_RECEIVED' && dynamic_server_state.at(-1).unacked == 0) {
    serverSendSYNACK()
    setNewEntryServer('unacked', 1)
    setNewEntryServer('seq_num', 1)
  } else if (dynamic_server_state.at(-1).tcp_state == 'SYN_RECEIVED'){
    clientSendACK()
    setNewEntryServer('tcp_state', 'ESTABLISHED')
    setNewEntryServer('unacked', 0)
  }
  
  notify()
  return
}

function setNewEntryServer(key, newValue) {
  const new_entry = {...dynamic_server_state.at(-1)}
  new_entry[key] = newValue
  dynamic_server_state.push(new_entry)
  return
}

function notify() {
  update_data_panel()
  return
}

function clientSendSYN() {

  const new_entry = {
    flag: 'SYN',
    timestamp: 0,
    delivery_time: (dynamic_settings.at(-1).rtt_ms / 2),
    ack_num: 0
  }
  console.log('Client:', new_entry)
  dynamic_clientside_packets.push(new_entry)
  return
}

function serverSendSYNACK() {
  const now = dynamic_clientside_packets.at(-1).delivery_time
  const new_entry = {
    flag: 'SYN_ACK',
    timestamp: now,
    delivery_time: now + (dynamic_settings.at(-1).rtt_ms / 2),
    ack_num: 1
  }
  console.log('Server:', new_entry)

  dynamic_serverside_packets.push(new_entry)
  return
}

function clientSendACK() {
  const now = dynamic_serverside_packets.at(-1).delivery_time
  const new_entry = {
    flag: 'ACK',
    timestamp: now,
    delivery_time: now + (dynamic_settings.at(-1).rtt_ms / 2),
    ack_num: 1
  }
  console.log('Client:', new_entry)

  dynamic_clientside_packets.push(new_entry)
}