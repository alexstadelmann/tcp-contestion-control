

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#tcpMessage').addEventListener('click', establishTcp)
})

function establishTcp() {
  const currentTcpState = getLastElem(dynamicServerState).tcpState

  switch (currentTcpState) {
    case tcpState.CLOSED:
      setServerState({ tcpState: tcpState.LISTEN })
      break

    case tcpState.LISTEN:
      clientSendSYN()
      //Server receives SYN
      setServerState({ tcpState: tcpState.SYN_RECEIVED })
      break

    case tcpState.SYN_RECEIVED:
      if (getLastElem(dynamicServerState).unacked === 0) {
        serverSendSYNACK()
        setServerState({
          unacked: 1,
          seqNum: 1,
        })
      } else {
        clientSendACK()
        setServerState({
          tcpState: tcpState.ESTABLISHED,
          unacked: 0,
          congWin: 1,
        })
      }
      break
  }

  notify()
}

function setServerState(arrayKeyValuePairs) {
  const newEntry = { ...getLastElem(dynamicServerState) }
  for (const [key, newValue] of Object.entries(arrayKeyValuePairs)) {
    newEntry[key] = newValue
  }

  dynamicServerState.push(newEntry)
}

function notify() {
  updateDataPanel()
  updateSeqDiagramMeta()
}

function clientSendSYN() {
  const now = getLastElem(dynamicServerState).clockMS
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
  getLastElem(dynamicServerState).clockMS += timeMS
}

function serverSendSYNACK() {
  const now = getLastElem(dynamicServerState).clockMS
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
  const now = getLastElem(dynamicServerState).clockMS
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
