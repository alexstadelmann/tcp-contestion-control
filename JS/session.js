const NONE = -1
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

const events = {
  START_SERVER: 'Start Server',
  SYN: 'Client sends SYN',
  ACK: 'Client sends ACK',
  SYN_ACK: 'Server sends SYN-ACK',
  SEG: 'New Segment',
  NEW_ACK: 'New Ack',
  SEG_LOSS: 'Segment lossed',
  ACK_LOSS: 'Ack lossed',
  DUP_ACK: 'Duplicate Ack',
  TIMEOUT: 'Timeout',
  DUP_3: '3 duplicate Acks',
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
  lastEvent: undefined,

}

const initialClientState = {
  segmentsReceivedInOrder: 1,
}

const dynamicServerState = [initialServerState]
const dynamicClientState = [initialClientState]
const dynamicServerSegments = []
const dynamicClientAcks = []
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

function setSettings(key, newValue) {
  const newEntrySettings = { ...getLastElem(dynamicSettings) }
  newEntrySettings[key] = newValue
  dynamicSettings.push(newEntrySettings)
}