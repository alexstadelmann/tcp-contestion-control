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
  getClientState,
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
    roundCongWin: [1, 1],
    firstofRoundSeq: 1,
    firstOfRoundMS: getSessionState('clockMS'),
    confirmedReceived: 1,
  })
  addPointToCongestionDiagram()
}

export function finalizeSession() {
  const currentTcpState = getServerState('tcpState')
  const lastEvent = getSessionState('lastEvent')

  switch (currentTcpState) {
    case tcpState.ESTABLISHED:
      if (lastEvent == events.FIN_SENT) {
        sendTcpMeta(agents.CLIENT, flags.FIN_ACK)
        setSessionState({
          lastEvent: events.FIN_ACK,
        })
      } else {
        sendTcpMeta(agents.SERVER, flags.FIN)
        setSessionState({
          lastEvent: events.FIN_SENT,
        })
        setServerState({
          tcpState: tcpState.FIN_WAIT_1,
        })
      }
      break
    case tcpState.FIN_WAIT_1:
      if (lastEvent == events.FIN_SENT) {
        sendTcpMeta(agents.CLIENT, flags.FIN_ACK)
        setSessionState({
          lastEvent: events.FIN_ACK,
        })
      } else {
        sendTcpMeta(agents.SERVER, flags.ACK)
        setSessionState({
          lastEvent: events.ACK,
        })
        setServerState({
          tcpState: tcpState.TIME_WAIT,
        })
      }

      break
    case tcpState.TIME_WAIT:
      setSessionState({
        lastEvent: events.WAIT_30s,
      })
      setServerState({
        tcpState: tcpState.CLOSED,
      })
  }
  updateSeqDiagramMeta()
  updateDataPanel()
}

function sendTcpMeta(from, flag) {
  const now = getSessionState('clockMS')
  const roundTripTimeMS = getConfigState('roundTripTimeMS')
  let newEntry = {}
  if (from == agents.CLIENT) {
    const ackNum = getClientState('BytesReceivedInOrder')
    newEntry = {
      sender: agents.CLIENT,
      flag,
      startMS: now,
      endMS: now + roundTripTimeMS / 2,
      ackNum,
    }
  } else if (from == agents.SERVER) {
    newEntry = {
      sender: agents.SERVER,
      flag,
      startMS: now,
      endMS: now + roundTripTimeMS / 2,
    }
  }
  metaPackets.push(newEntry)
  addToClockMs(roundTripTimeMS / 2)
}
