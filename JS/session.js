// property naming convension
const initialServerState = {
  tcpState: 'CLOSED', // reuse of state keywords
  ccState: 'SLOW-START',
  seqNum: 0,
  unacked: 0,
  threshold: 5,
  congWin: 0,
  clockMS: 0,
}

const initialClientState = {
  tcpState: 'CLOSED',
  sendAck: 0,
}

const dynamicServerState = [initialServerState]
// not used anyway
const dynamicClientState = [initialClientState]
const dynamicServersidePackets = []
const dynamicClientsidePackets = []
const dynamicPendingAcks = []
const dynamicMetaPackets = []
