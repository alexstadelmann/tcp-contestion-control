"use strict"
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#TCP_message").addEventListener("click", () => {
    establishTCP()
  })
})

function establishTCP() {
  console.log(dynamic_server_state.at(-1))
  if (dynamic_server_state.at(-1).tcp_state == "CLOSED") {
    setServerState({ tcp_state: "LISTEN" })
  } else if (dynamic_server_state.at(-1).tcp_state == "LISTEN") {
    clientSendSYN()
    //Server receives SYN
    setServerState({ tcp_state: "SYN_RECEIVED" })
    
  } else if (
    dynamic_server_state.at(-1).tcp_state == "SYN_RECEIVED" &&
    dynamic_server_state.at(-1).unacked == 0
  ) {
    serverSendSYNACK()
    setServerState({ unacked: 1, seq_num: 1 })
  } else if (dynamic_server_state.at(-1).tcp_state == "SYN_RECEIVED") {
    clientSendACK()
    setServerState({ tcp_state: "ESTABLISHED", unacked: 0,'cong_win': 1 })
  }
  notify()
  return
}

function setServerState(array_of_key_value_pairs) {
  const new_entry = { ...dynamic_server_state.at(-1) }
  for (const [key, newValue] of Object.entries(array_of_key_value_pairs)) {
    new_entry[key] = newValue
  }
  dynamic_server_state.push(new_entry)
  return
}

function notify() {
  update_data_panel()
  return
}

function clientSendSYN() {
  const now = dynamic_server_state.at(-1).clock_ms
  const rtt_ms = dynamic_settings.at(-1).rtt_ms

  const new_entry = {
    flag: "SYN",
    start_ms: now,
    end_ms: now + rtt_ms/2,
    ack_num: 0,
  }

  console.log("Client:", new_entry)
  dynamic_clientside_packets.push(new_entry)
  addToClockMs(rtt_ms/2)
  return
}

function addToClockMs(time_ms) {
  dynamic_server_state.at(-1).clock_ms += time_ms
}

function serverSendSYNACK() {
  const now = dynamic_server_state.at(-1).clock_ms
  const rtt_ms = dynamic_settings.at(-1).rtt_ms
  const new_entry = {
    flag: "SYN_ACK",
    start_ms: now,
    end_ms: now + rtt_ms/2,
    ack_num: 1,
  }
  
  dynamic_serverside_packets.push(new_entry)
  addToClockMs(rtt_ms/2)
  return
}

function clientSendACK() {
  const now = dynamic_server_state.at(-1).clock_ms
  const rtt_ms = dynamic_settings.at(-1).rtt_ms
  const new_entry = {
    flag: "ACK",
    start: now,
    end: now + rtt_ms/2,
    ack_num: 1,
  }
  addToClockMs(rtt_ms/2)
  dynamic_clientside_packets.push(new_entry)
}
