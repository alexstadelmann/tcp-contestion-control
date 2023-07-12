

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#startButton').addEventListener('click', establishTcp)
})

function establishTcp() {
  const currentTcpState = getLastElem(dynamicServerState).tcpState

  switch (currentTcpState) {
    case tcpState.CLOSED:
      setServerState({
        tcpState: tcpState.LISTEN,
        lastEvent: events.START_SERVER  })
      break

    case tcpState.LISTEN:
      clientSendSYN()
      setServerState({
        tcpState: tcpState.SYN_RECEIVED,
        lastEvent: events.SYN
      })
      break

    case tcpState.SYN_RECEIVED:
      if (getLastElem(dynamicServerState).unacked === 0) {
        serverSendSYNACK()
        setServerState({
          unacked: 1,
          seqNum: 1,
          lastEvent: events.SYN_ACK
        })
      } else {
        clientSendACK()
        setServerState({
          tcpState: tcpState.ESTABLISHED,
          unacked: 0,
          congWin: 1,
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

const activateAllButtons = () => {
  document.querySelectorAll('#press input').forEach ((button => {
    button.removeAttribute('disabled')
  }))
}



function clientSendSYN() {
  const now = getLastElem(dynamicSessionState).clockMS
  const roundTripTimeMS = getLastElem(dynamicSettings).roundTripTimeMS

  const newEntry = {
    sender: agents.CLIENT,
    flag: flags.SYN,
    startMS: now,
    endMS: now + roundTripTimeMS / 2,
    ackNum: 0,
  }

  dynamicMetaPackets.push(newEntry)
  addToClockMs(roundTripTimeMS / 2)
}

function addToClockMs(timeMS) {
  getLastElem(dynamicSessionState).clockMS += timeMS
}

function serverSendSYNACK() {
  const now = getLastElem(dynamicSessionState).clockMS
  const roundTripTimeMS = getLastElem(dynamicSettings).roundTripTimeMS
  const newEntry = {
    sender: agents.SERVER,
    flag: flags.SYN_ACK,
    startMS: now,
    endMS: now + roundTripTimeMS / 2,
    ackNum: 1,
  }

  dynamicMetaPackets.push(newEntry)
  addToClockMs(roundTripTimeMS / 2)
}

function clientSendACK() {
  const now = getLastElem(dynamicSessionState).clockMS
  const roundTripTimeMS = getLastElem(dynamicSettings).roundTripTimeMS
  const newEntry = {
    sender: agents.CLIENT,
    flag: flags.ACK,
    startMS: now,
    endMS: now + roundTripTimeMS / 2,
    ackNum: 1,
  }

  addToClockMs(roundTripTimeMS / 2)
  dynamicMetaPackets.push(newEntry)
}
