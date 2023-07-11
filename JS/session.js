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
  confirmedReceived: 0,
  unacked: 0,
  threshold: 5,
  congWin: 0,
  clockMS: 0,
  firstUnackedSegmentNum: 0,

}

const initialClientState = {
  segmentsReceivedInOrder: 1,
}

const dynamicServerState = [initialServerState]
const dynamicClientState = [initialClientState]
const dynamicServersidePackets = []
const dynamicClientsidePackets = []
const dynamicPendingAcks = []
const dynamicMetaPackets = []

const getLastElem = (array) => {
  return array.at(-1)
}

function setServerState(arrayKeyValuePairs) {
  const newEntry = { ...getLastElem(dynamicServerState) }
  for (const [key, newValue] of Object.entries(arrayKeyValuePairs)) {
    newEntry[key] = newValue
  }

  dynamicServerState.push(newEntry)
}

function setClientState(arrayKeyValuePairs) {
  const newEntry = { ...getLastElem(dynamicClientState) }
  for (const [key, newValue] of Object.entries(arrayKeyValuePairs)) {
    newEntry[key] = newValue
  }

  dynamicClientState.push(newEntry)
}
