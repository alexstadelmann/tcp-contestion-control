const NONE = -1
const algorithms = {
  SLOW_START: 'SLOW_START',
  FAST_RECOVERY: 'FAST_RECOVERY',
  CONGESTION_AVOIDANCE: 'CONGESTION_AVOIDANCE',
  TIMEOUT: 'TIMEOUT_TRANS',
  DUP_3: 'DUPLICATE_TRANS'
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
  START_SERVER: 'start server',
  SYN: 'SYN',
  ACK: 'ACK',
  SYN_ACK: 'SYN ACK',
  SEG: 'segment send',
  NEW_ACK: 'ACK',
  SEG_LOSS: 'segment loss',
  ACK_LOSS: 'ACK loss',
  DUP_ACK: 'dupplicate ACK',
  TIMEOUT: 'timeout',
  DUP_3: '3 duplicates',
  THRESHOLD_REACHED: 'threshold',
  RETRANSMISSION: 'retrans',
  RETRANSMIT_LOSS: 'retrans loss'
}

const basicSettings = {
  version: 'tahoe',
  roundTripTimeMS: 200,
  seqSizeByte: 500,
  transrateKBytePerSecond: 20,
  initialThreshold: 10,
  lang: 'en',
  ratio1pxToMS: 1,
  timeoutSpan: 3,
  
}

const settings = [{ ...basicSettings }]

const getLastElem = (array) => {
  return array.at(-1)
}

const initialServerState = {
  tcpState: tcpState.CLOSED,
  ccState: algorithms.SLOW_START,
  seqNum: 0,
  confirmedReceived: 0,
  currentTraffic: 0,
  threshold: getLastElem(settings).initialThreshold,
  congWin: 0,
  congWinFractions: 0,
  firstUnackedSegmentNum: 0,
  duplicateAcks: 0,
  timestampFirstUnacked: 0,
}

const initialClientState = {
  BytesReceivedInOrder: 1,
}

const initialSessionState = {
  lastEvent: '',
  clockMS: 0,
}

let serverState = [{...initialServerState}]
let clientState = [{...initialClientState}]
let sessionState = [{...initialSessionState}]
let serverSegments = []
let clientAcks = []
let clientBuffer = new Set()
let pendingAcks = []
let metaPackets = []

function resetApplication() {
  serverState = [{...initialServerState}]
  clientState = [{...initialClientState}]
  serverSegments = []
  clientAcks = []
  pendingAcks = []
  metaPackets = []
  updateDataPanel()

  //Empty sequence diagram
  document.querySelectorAll('#mainSvg g').forEach((elem)=>{
    elem.innerHTML = ''
  })

  //Make only start button clickable
  deactivateAllButtons()
  activateStartButton()

  //Make main svg small again
  document.querySelector('#mainSvg').viewBox.baseVal.height = 100
  document.querySelector('#mainSvg').style.height = '100%'
  
}



function setServerState(keyValuePairs) {
  const newEntry = { ...getLastElem(serverState) }
  for (const [key, newValue] of Object.entries(keyValuePairs)) {
    newEntry[key] = newValue
  }
  serverState.push(newEntry)
}


function setClientState(keyValuePairs) {
  const newEntry = { ...getLastElem(clientState) }
  for (const [key, newValue] of Object.entries(keyValuePairs)) {
    newEntry[key] = newValue
  }
  clientState.push(newEntry)
}

function setSessionState(keyValuePairs) {
  const newEntry = { ...getLastElem(sessionState) }
  for (const [key, newValue] of Object.entries(keyValuePairs)) {
    newEntry[key] = newValue
  }
  sessionState.push(newEntry)
}

function setConfigState(keyValuePairs) {
  const newEntry = { ...getLastElem(settings) }
  for (const [key, newValue] of Object.entries(keyValuePairs)) {
    newEntry[key] = newValue
  }
  settings.push(newEntry)
}

function getConfigState(key) {
  return getLastElem(settings)[key]
}

function addSegment(keyValuePairs) {
  const newEntry = { ...getLastElem(sessionState) }
  for (const [key, newValue] of Object.entries(keyValuePairs)) {
    newEntry[key] = newValue
  }
  sessionState.push(newEntry)
}


function setSettings(key, newValue) {
  const newEntrySettings = { ...getLastElem(settings) }
  newEntrySettings[key] = newValue
  settings.push(newEntrySettings)
}


function getServerState(key) {
  return getLastElem(serverState)[key]
}

function getClientState(key) {
  return getLastElem(clientState)[key]
}

function getSessionState(key) {
  return getLastElem(sessionState)[key]
}

function getSegmentAttribute(key) {
  return getLastElem(serverSegments)[key]
}

function setSegAttribute(key, value) {
  console.log('key', key,'value: ',value)
  serverSegments.at(-1)[key] = value
}