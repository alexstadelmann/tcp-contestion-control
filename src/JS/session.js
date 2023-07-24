import updateDataPanel from '@/JS/parameterDisplay'
import { activateStartButton, deactivateAllButtons } from '@/JS/tcpMetaLogic'

export const NONE = -1
export const algorithms = {
  SLOW_START: 'SLOW_START',
  FAST_RECOVERY: 'FAST_RECOVERY',
  CONGESTION_AVOIDANCE: 'CONGESTION_AVOIDANCE',
  TIMEOUT: 'TIMEOUT_TRANS',
  DUP_3: 'DUPLICATE_TRANS',
}

export const flags = {
  SYN: 'SYN',
  ACK: 'ACK',
  SYN_ACK: 'SYN-ACK',
  FIN: 'FIN',
  FIN_ACK: 'FIN-ACK'
}

export const agents = {
  CLIENT: 'CLIENT',
  SERVER: 'SERVER',
}

export const tcpState = {
  CLOSED: 'CLOSED',
  LISTEN: 'LISTEN',
  SYN_RECEIVED: 'SYN-RECEIVED',
  ESTABLISHED: 'ESTABLISHED',
  FIN_WAIT_1: 'FIN_WAIT_1',
  TIME_WAIT: 'TIME_WAIT',
}

export const events = {
  START_SERVER: 'Start server',
  SYN: 'SYN',
  ACK: 'ACK',
  SYN_ACK: 'SYN ACK',
  SEG: 'Server sends segment ',
  NEW_ACK: 'ACK',
  SEG_LOSS: 'Segment is lost',
  ACK_LOSS: 'ACK is lost',
  DUP_ACK: 'Dupplicate ACK',
  TIMEOUT: 'Timeout',
  DUP_3: 'Three duplicates',
  THRESHOLD_REACHED: 'Threshold',
  RETRANSMISSION: 'Retransmission',
  RETRANSMIT_LOSS: 'Retransmission is lost',
  FIN_SENT: 'FIN',
  FIN_ACK: 'FIN_ACK',
  WAIT_30s: 'Server has waited 30s',
}

const basicSettings = {
  version: 'tahoe',
  roundTripTimeMS: 400,
  segSizeByte: 500,
  transrateKBytePerSecond: 20,
  initialThreshold: 16,
  lang: 'en',
  ratio1pxToMS: 1,
  timeoutSpan: 2,
}

export const settings = [{ ...basicSettings }]

export const getLastElem = (array) => {
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
  round: 0,
  roundCongWin: [0,0],
  firstOfRoundSeq: 0,
  firstOfRoundMS: 0,
}

const initialClientState = {
  BytesReceivedInOrder: 1,
}

const initialSessionState = {
  lastEvent: '',
  clockMS: 0,
}

// unnecessary lets
export let serverState = [{ ...initialServerState }]
let clientState = [{ ...initialClientState }]
export let sessionState = [{ ...initialSessionState }]
export let serverSegments = []
export let clientAcks = []
export let clientBuffer = new Set()
export let pendingAcks = []
export let metaPackets = []

export function resetApplication() {
  serverState = [{ ...initialServerState }]
  clientState = [{ ...initialClientState }]
  serverSegments = []
  clientAcks = []
  pendingAcks = []
  metaPackets = []
  updateDataPanel()

  //Empty sequence diagram
  document.querySelectorAll('#mainSvg g').forEach((elem) => {
    elem.innerHTML = ''
  })

  //Make only start button clickable
  deactivateAllButtons()
  activateStartButton()

  //Make main svg small again
  document.querySelector('#mainSvg').viewBox.baseVal.height = 100
  document.querySelector('#mainSvg').style.height = '100%'
}

export function setServerState(keyValuePairs) {
  const newEntry = { ...getLastElem(serverState) }
  for (const [key, newValue] of Object.entries(keyValuePairs)) {
    newEntry[key] = newValue
  }
  serverState.push(newEntry)
}

export function setClientState(keyValuePairs) {
  const newEntry = { ...getLastElem(clientState) }
  for (const [key, newValue] of Object.entries(keyValuePairs)) {
    newEntry[key] = newValue
  }
  clientState.push(newEntry)
}

export function setSessionState(keyValuePairs) {
  const newEntry = { ...getLastElem(sessionState) }
  for (const [key, newValue] of Object.entries(keyValuePairs)) {
    newEntry[key] = newValue
  }
  sessionState.push(newEntry)
}

export function getConfigState(key) {
  return getLastElem(settings)[key]
}

export function setSettings(key, newValue) {
  const newEntrySettings = { ...getLastElem(settings) }
  newEntrySettings[key] = newValue
  settings.push(newEntrySettings)
}

export function getServerState(key) {
  return getLastElem(serverState)[key]
}

export function getClientState(key) {
  return getLastElem(clientState)[key]
}

export function getSessionState(key) {
  return getLastElem(sessionState)[key]
}

export function getSegmentAttribute(key) {
  return getLastElem(serverSegments)[key]
}
