import updateDataPanel from '@/JS/parameterDisplay'
import { updateSeqDiagramMeta } from '@/JS/tcpMetaVisual'
import { addPointToCongestionDiagram } from './congestionDiagram'
import {
  flags,
  agents,
  events,
  tcpState,
  metaPackets,
  getServerState,
  setServerState,
  getConfigState,
  setSessionState,
  getSessionState,
} from '@/JS/session'

export function establishTcp() {
  const currentTcpState = getServerState('tcpState')

  switch (currentTcpState) {
    case tcpState.CLOSED:
      setServerState({
        tcpState: tcpState.LISTEN,
      })
      setSessionState({
        lastEvent: events.START_SERVER,
      })
      break

    case tcpState.LISTEN:
      clientSendSYN()
      setServerState({
        tcpState: tcpState.SYN_RECEIVED,
      })
      setSessionState({
        lastEvent: events.SYN,
      })
      break

    case tcpState.SYN_RECEIVED:
      if (getServerState('currentTraffic') === 0) {
        serverSendSYNACK()
        setServerState({
          currentTraffic: 1,
          seqNum: 1,
        })
        setSessionState({
          lastEvent: events.SYN_ACK,
        })
      } else {
        clientSendACK()
        setServerState({
          tcpState: tcpState.ESTABLISHED,
          currentTraffic: 0,
          congWin: 1,
        })
        setSessionState({
          lastEvent: events.ACK,
        })
        activateAllButtons()
        deactivateStartButton()
      }
      break
  }
  updateSeqDiagramMeta()
  updateDataPanel()
}

const deactivateStartButton = () => {
  document.querySelector('#startButton').setAttribute('disabled', '')
}

export const activateStartButton = () => {
  document.querySelector('#startButton').removeAttribute('disabled')
}

const activateAllButtons = () => {
  document.querySelectorAll('#press button').forEach((button) => {
    button.removeAttribute('disabled')
  })
}
export const deactivateAllButtons = () => {
  document.querySelectorAll('#press button').forEach((button) => {
    button.setAttribute('disabled', '')
  })
}

function clientSendSYN() {
  const now = getSessionState('clockMS')
  const roundTripTimeMS = getConfigState('roundTripTimeMS')

  const newEntry = {
    sender: agents.CLIENT,
    flag: flags.SYN,
    startMS: now,
    endMS: now + roundTripTimeMS / 2,
    ackNum: 0,
  }

  metaPackets.push(newEntry)
  addToClockMs(roundTripTimeMS / 2)
}

export function addToClockMs(timeMS) {
  setSessionState({
    clockMS: getSessionState('clockMS') + timeMS,
  })
}

function serverSendSYNACK() {
  const now = getSessionState('clockMS')
  const roundTripTimeMS = getConfigState('roundTripTimeMS')
  const newEntry = {
    sender: agents.SERVER,
    flag: flags.SYN_ACK,
    startMS: now,
    endMS: now + roundTripTimeMS / 2,
    ackNum: 1,
  }

  metaPackets.push(newEntry)
  addToClockMs(roundTripTimeMS / 2)
}

function clientSendACK() {
  const now = getSessionState('clockMS')
  const roundTripTimeMS = getConfigState('roundTripTimeMS')
  const newEntry = {
    sender: agents.CLIENT,
    flag: flags.ACK,
    startMS: now,
    endMS: now + roundTripTimeMS / 2,
    ackNum: 1,
  }

  addToClockMs(roundTripTimeMS / 2)
  metaPackets.push(newEntry)

  setServerState({
    congWin: 1,
    round: 1,
    roundCongWin:[1,1],
    firstofRoundSeq: 1,
    firstOfRoundMS: getSessionState('clockMS'),
  })
  addPointToCongestionDiagram()
}


