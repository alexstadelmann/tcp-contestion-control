'use strict'

const initial_server_state = {
  tcp_state: 'CLOSED',
  cc_state: 'SLOW_START',
  seq_num: 0,
  unacked: 0,
  threshold: 5,
  cong_win: 0,
  clock_ms: 0,
}

const initial_client_state ={
  tcp_state: 'CLOSED',
  send_ack: 0,

}



const dynamic_server_state = [{...initial_server_state}]
const dynamic_client_state = [{...initial_client_state}]
const dynamic_serverside_packets = []
const dynamic_clientside_packets = []
const dynamic_pending_acks = []
const dynamic_meta_packets = []
console.log('client',dynamic_clientside_packets)
console.log('server',dynamic_serverside_packets)
document.addEventListener('DOMContentLoaded', () => {

})