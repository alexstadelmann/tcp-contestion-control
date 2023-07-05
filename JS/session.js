

const initial_server_state = {
  tcp_state: 'listen',
  cc_state: 'slowStart',
  timer: 0,
  seq_num: 0,
  already_acked: 0,
}

const dynamic_server_state = [{...initial_server_state}]

document.addEventListener('DOMContentLoaded', () =>{
  
})