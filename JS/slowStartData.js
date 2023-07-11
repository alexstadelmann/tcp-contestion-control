document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#send').addEventListener('click',()=> {
    sendSlowStart(true)
  })
  document.querySelector('#loss').addEventListener('click', ()=> {
    sendSlowStart(false)
  })
})




function sendSlowStart(isDelivered) {
  if (checkTimeoutNow()) {
    triggerTimeout()
    return
  } 
  if (isPendingAck()) {
    receiveAck(isDelivered)
    displayNewAck()
  } else if (
    getLastElem(dynamicServerState).congWin > getLastElem(dynamicServerState).unacked
  ) {
    sendNewSegment(isDelivered)
    displayNewSegment()
    displayTimeoutBar()
  } else {
    if (checkTimeoutLater()) {
      triggerTimeout()
      return
    } 
    receiveAck(isDelivered)
    displayNewAck()
  }
  updateDataPanel()
  
  console.log('serverState', getLastElem(dynamicServerState))
  console.log('clientState', getLastElem(dynamicClientState))
  console.log('serversidePackets', dynamicServersidePackets)
}

function checkTimeoutNow() {
  const now = getLastElem(dynamicSettings).clockMS
  const timestampLastAcked = getLastElem(dynamicSettings).timestampLastAcked
  const timeoutSpan = getLastElem(dynamicSettings).timeoutSpan
  return now - timestampLastAcked >= timeoutSpan
}

function checkTimeoutLater() {
  if (dynamicPendingAcks.length == 0) return true
  timeNextAck = getLastElem(dynamicPendingAcks).endMS

  
  
  const timestampLastAcked = getLastElem(dynamicSettings).timestampLastAcked
  const timeoutSpan = getLastElem(dynamicSettings).timeoutSpan
  return timeNextAck - timestampLastAcked >= timeoutSpan
}

function receiveAck(isDelivered) {
  if(!isDelivered) return
  const newAck = getLastElem(dynamicPendingAcks)
  const congWin = getLastElem(dynamicServerState).congWin
  const unacked = getLastElem(dynamicServerState).unacked
  dynamicClientsidePackets.push(newAck)
  const ackNum = newAck.ackNum
  const firstUnackedSegmentNum = getLastElem(dynamicServerState).firstUnackedSegmentNum
  const seqSizeByte = getLastElem(dynamicSettings).seqSizeByte
  const timestampLastAcked = dynamicServersidePackets[firstUnackedSegmentNum].sendingCompleteMS
  setClock(newAck.endMS)
  
  setServerState({
    congWin: congWin + 1,
    unacked: unacked - 1,
    confirmedReceived: ackNum,

  })

  if (ackNum == dynamicServersidePackets[firstUnackedSegmentNum].seqNum + seqSizeByte) {
    setServerState({
      firstUnackedSegmentNum: firstUnackedSegmentNum + 1,
      timestampLastAcked: timestampLastAcked,
    })
  }
  if (dynamicPendingAcks.length == 1) {
    setTimestampFirstUnacked(-1)
  } else {
    setTimestampFirstUnacked(dynamicPendingAcks.at(-2).ackNum)
  }
}



function setClock(time) {
  const newEntry = { ...getLastElem(dynamicServerState) }
  newEntry.clockMS = time
  dynamicServerState.push(newEntry)
}

function isPendingAck() {
  if (dynamicPendingAcks.length == 0) return false
  const timeNextAck = getLastElem(dynamicPendingAcks).endMS
  return timeNextAck == getLastElem(dynamicServerState).clockMS
}

function setTimestampFirstUnacked(time) {
  const newEntry = { ...getLastElem(dynamicServerState) }
  newEntry.timestampFirstUnacked = time
  dynamicServerState.push(newEntry)
}



function sendNewSegment(isDelivered) {
  const now = getLastElem(dynamicServerState).clockMS
  const seqSizeByte = getLastElem(dynamicSettings).seqSizeByte
  const seqNum = getLastElem(dynamicServerState).seqNum
  const roundTripTimeMS = getLastElem(dynamicSettings).roundTripTimeMS
  const transrateKBytePerSecond = getLastElem(dynamicSettings).transrateKBytePerSecond
  const sendingCompleteMS = now + seqSizeByte / transrateKBytePerSecond
  const delayMS = seqSizeByte / transrateKBytePerSecond + roundTripTimeMS / 2
  const unacked = getLastElem(dynamicServerState).unacked

  const newSegment = {
    startMS: now,
    endMS: now + delayMS,
    sendingCompleteMS:sendingCompleteMS,
    seqNum: seqNum,
    isDelivered,
  }

  if (getLastElem(dynamicServerState).timestampFirstUnacked == -1) {
    setTimestampFirstUnacked(sendingCompleteMS)
  }

  dynamicServersidePackets.push(newSegment)
  addToClockMs(seqSizeByte / transrateKBytePerSecond)
  if (newSegment.isDelivered && getLastElem(dynamicClientState).segmentsReceivedInOrder == seqNum) {
    setClientState({
      segmentsReceivedInOrder: seqNum + seqSizeByte
    })
  }
  setServerState({
    seqNum: seqNum + seqSizeByte,
    unacked: unacked + 1,
  })

  if (!newSegment.isDelivered) return
  
  //Create the acknowlegement for the new segment
  const newAck = {
    startMS: newSegment.endMS,
    endMS: newSegment.endMS + roundTripTimeMS / 2,
    ackNum: getLastElem(dynamicClientState).segmentsReceivedInOrder,
    sendingSegmentCompleteMS: newSegment.sendingCompleteMS
  }

  dynamicPendingAcks.unshift(newAck)
  

}
