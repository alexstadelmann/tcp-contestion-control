"use strict"

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#TCP_message").addEventListener("click", establishTCP)
})

function establishTCP() {
  console.log(dynamicServerState.at(-1))
  const tcpState = dynamicServerState.at(-1).tcp_state 
  
  switch (tcpState) {
    case "CLOSED":
      setServerState({ tcp_state: "LISTEN" })
      break
    
    case "LISTEN":
      clientSendSYN()
      //Server receives SYN
      setServerState({ tcp_state: "SYN_RECEIVED" })
      break

    case "SYN_RECEIVED":
      if (dynamicServerState.at(-1).unacked === 0) {
        serverSendSYNACK()
        setServerState({
          unacked: 1,
          seq_num: 1
        }) 
      } else {
        clientSendACK()
        setServerState({
          tcp_state: "ESTABLISHED",
          unacked: 0,
          cong_win: 1
        }) 
      }
      break
  }

  notify()
}

function setServerState(array_of_key_value_pairs) {
  const new_entry = { ...dynamicServerState.at(-1) }
  for (const [key, newValue] of Object.entries(array_of_key_value_pairs)) {
    new_entry[key] = newValue
  }

  dynamicServerState.push(new_entry)
}

function notify() {
  updateDataPanel()
  update_seq_diagram_meta()
}

function clientSendSYN() {
  const now = dynamicServerState.at(-1).clock_ms
  const rtt_ms = dynamicSettings.at(-1).rtt_ms

  const new_entry = {
    sender: "client",
    flag: "SYN",
    start_ms: now,
    end_ms: now + rtt_ms / 2,
    ack_num: 0,
  }

  console.log("Client:", new_entry)
  dynamicMetaPackets.push(new_entry)
  addToClockMs(rtt_ms / 2)
}

function addToClockMs(time_ms) {
  dynamicServerState.at(-1).clock_ms += time_ms
}

function serverSendSYNACK() {
  const now = dynamicServerState.at(-1).clock_ms
  const rtt_ms = dynamicSettings.at(-1).rtt_ms
  const new_entry = {
    sender: "server",
    flag: "SYN-ACK",
    start_ms: now,
    end_ms: now + rtt_ms / 2,
    ack_num: 1,
  }
  
  dynamicMetaPackets.push(new_entry)
  addToClockMs(rtt_ms / 2)
}

function clientSendACK() {
  const now = dynamicServerState.at(-1).clock_ms
  const rtt_ms = dynamicSettings.at(-1).rtt_ms
  const new_entry = {
    sender: "client",
    flag: "ACK",
    start_ms: now,
    end_ms: now + rtt_ms / 2,
    ack_num: 1,
  }

  addToClockMs(rtt_ms / 2)
  dynamicMetaPackets.push(new_entry)
}
