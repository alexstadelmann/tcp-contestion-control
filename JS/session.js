"use strict"
// need of use strict

// property naming convension
const initialServerState = {
  tcp_state: "CLOSED", // reuse of state keywords
  cc_state: "SLOW_START",
  seq_num: 0,
  unacked: 0,
  threshold: 5,
  cong_win: 0,
  clock_ms: 0,
}

const initialClientState ={
  tcp_state: "CLOSED",
  send_ack: 0,
}

const dynamicServerState = [initialServerState]
// not used anyway
const dynamicClientState = [initialClientState]
const dynamicServersidePackets = []
const dynamicClientsidePackets = []
const dynamicPendingAcks = []
const dynamicMetaPackets = []
console.log("client", dynamicClientsidePackets)
console.log("server", dynamicServersidePackets)
