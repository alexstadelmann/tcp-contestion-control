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
  timeoutSpan: 400
}

const dynamicSettings = [{ ...basicSettings }]

const getLastElem = (array) => {
  return array.at(-1)
}

const initialServerAndSessionState = {
  tcpState: tcpState.CLOSED,
  ccState: algorithms.SLOW_START,
  seqNum: 0,
  confirmedReceived: 0,
  currentTraffic: 0,
  threshold: getLastElem(dynamicSettings).initialThreshold,
  congWin: 0,
  congWinFractions: 0,
  firstUnackedSegmentNum: 0,
  duplicateAcks: 0,
}

const initialClientState = {
  segmentsReceivedInOrder: 1,
}

const initialSessionState = {
  lastEvent: '',
  clockMS: 0,
}

let dynamicServerAndSessionState = [{...initialServerAndSessionState}]
let dynamicClientState = [{...initialClientState}]
let dynamicSessionState = [{...initialSessionState}]
let dynamicServerSegments = []
let dynamicClientAcks = []
let dynamicPendingAcks = []
let dynamicMetaPackets = []

function resetApplication() {
  dynamicServerAndSessionState = [{...initialServerAndSessionState}]
  dynamicClientState = [{...initialClientState}]
  dynamicServerSegments = []
  dynamicClientAcks = []
  dynamicPendingAcks = []
  dynamicMetaPackets = []
  updateDataPanel()

  //Empty sequence diagram
  document.querySelectorAll('#mainSvg g').forEach((elem)=>{
    console.log(elem)
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
  const newEntry = { ...getLastElem(dynamicServerAndSessionState) }
  for (const [key, newValue] of Object.entries(keyValuePairs)) {
    newEntry[key] = newValue
  }
  dynamicServerAndSessionState.push(newEntry)
}


function setClientState(keyValuePairs) {
  const newEntry = { ...getLastElem(dynamicClientState) }
  for (const [key, newValue] of Object.entries(keyValuePairs)) {
    newEntry[key] = newValue
  }
  dynamicClientState.push(newEntry)
}

function setSessionState(keyValuePairs) {
  const newEntry = { ...getLastElem(dynamicSessionState) }
  for (const [key, newValue] of Object.entries(keyValuePairs)) {
    newEntry[key] = newValue
  }
  dynamicSessionState.push(newEntry)
}

function setSettings(key, newValue) {
  const newEntrySettings = { ...getLastElem(dynamicSettings) }
  newEntrySettings[key] = newValue
  dynamicSettings.push(newEntrySettings)
}