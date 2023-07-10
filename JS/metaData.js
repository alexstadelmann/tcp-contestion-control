document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#tcpMessage').addEventListener('click', establishTcp)
})

function establishTcp() {
  const tcpState = dynamicServerState.at(-1).tcpState

  switch (tcpState) {
    case 'CLOSED':
      setServerState({ tcpState: 'LISTEN' })
      break

    case 'LISTEN':
      clientSendSYN()
      //Server receives SYN
      setServerState({ tcpState: 'SYN-RECEIVED' })
      break

    case 'SYN-RECEIVED':
      if (dynamicServerState.at(-1).unacked === 0) {
        serverSendSYNACK()
        setServerState({
          unacked: 1,
          seqNum: 1,
        })
      } else {
        clientSendACK()
        setServerState({
          tcpState: 'ESTABLISHED',
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
    sender: 'client',
    flag: 'SYN',
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
    sender: 'server',
    flag: 'SYN-ACK',
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
    sender: 'client',
    flag: 'ACK',
    startMS: now,
    endMS: now + roundTripTimeMS / 2,
    ackNum: 1,
  }

  addToClockMs(roundTripTimeMS / 2)
  dynamicMetaPackets.push(newEntry)
}
