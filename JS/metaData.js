

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#tcpMessage').addEventListener('click', establishTcp)
})

function establishTcp() {
  const currentTcpState = dynamicServerState.at(-1).tcpState

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
      if (dynamicServerState.at(-1).unacked === 0) {
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
  const newEntry = { ...dynamicServerState.at(-1) }
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
  const now = dynamicServerState.at(-1).clockMS
  const roundTripTimeMS = dynamicSettings.at(-1).roundTripTimeMS

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
  dynamicServerState.at(-1).clockMS += timeMS
}

function serverSendSYNACK() {
  const now = dynamicServerState.at(-1).clockMS
  const roundTripTimeMS = dynamicSettings.at(-1).roundTripTimeMS
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
  const now = dynamicServerState.at(-1).clockMS
  const roundTripTimeMS = dynamicSettings.at(-1).roundTripTimeMS
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
