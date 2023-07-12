const NONE = -1
const algorithms = {
  SLOW_START: 'SLOW_START',
  FAST_RECOVERY: 'FAST_RECOVERY',
  CONGESTION_AVOIDANCE: 'CONGESTION_AVOIDANCE',
  TIMEOUT: 'TIMEOUT',
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
  SEG: 'Server sends Segment',
  NEW_ACK: 'Client sends Ack',
  SEG_LOSS: 'Segment loss',
  ACK_LOSS: 'Ack loss',
  DUP_ACK: 'Duplicate Ack',
  TIMEOUT: 'Timeout',
  DUP_3: '3 duplicate Acks',
  THRESHOLD_REACHED: 'Threshold reached',
  RETRANSMISSION: 'Retransmission',
  RETRANSMIT_LOSS: 'Retransmission Segment Loss'
}

const initialServerState = {
  tcpState: tcpState.CLOSED,
  ccState: algorithms.SLOW_START,
  seqNum: 0,
  confirmedReceived: 0,
  unacked: 0,
  threshold: 5,
  congWin: 0,
  firstUnackedSegmentNum: 0,
  duplicateAcks: 0,
  


}

const initialClientState = {
  segmentsReceivedInOrder: 1,
}

const initialSessionState = {
  clockMS: 0,
  lastEvent: undefined,
}

let dynamicServerState = [{...initialServerState}]
let dynamicClientState = [{...initialClientState}]
let dynamicSessionState = [{...initialSessionState}]
let dynamicServerSegments = []
let dynamicClientAcks = []
let dynamicPendingAcks = []
let dynamicMetaPackets = []

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

function setSessionState(arrayKeyValuePairs) {
  const newEntry = { ...getLastElem(dynamicSessionState) }
  for (const [key, newValue] of Object.entries(arrayKeyValuePairs)) {
    newEntry[key] = newValue
  }
  dynamicSessionState.push(newEntry)
}

function setSettings(key, newValue) {
  const newEntrySettings = { ...getLastElem(dynamicSettings) }
  newEntrySettings[key] = newValue
  dynamicSettings.push(newEntrySettings)
}