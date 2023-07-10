const algorithms = {
  SLOW_START: 'SLOW-START',
}

const flags = {
  SYN: 'SYN',
  ACK: 'ACK',
  SYN_ACK: 'SYN-ACK'
}

const agents = {
  CLIENT: 'CLIENT',
  SERVER: 'SERVER',
}

const tcpState = {
  CLOSED: 'CLOSED',
  LISTEN: 'LISTEN',
  SYN_RECEIVED: 'SYN-RECEIVED',
  ESTABLISHED: 'ESTABLISHED',
}

const initialServerState = {
  tcpState: tcpState.CLOSED,
  ccState: algorithms.SLOW_START,
  seqNum: 0,
  unacked: 0,
  threshold: 5,
  congWin: 0,
  clockMS: 0,
}

const dynamicServerState = [initialServerState]
const dynamicServersidePackets = []
const dynamicClientsidePackets = []
const dynamicPendingAcks = []
const dynamicMetaPackets = []
