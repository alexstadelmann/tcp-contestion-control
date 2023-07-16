import displayNewAck from '@/JS/nextAckVisual'
import updateDataPanel from '@/JS/parameterDisplay'
import displayNewSegment from '@/JS/nextSegmentVisual'
import { displayTimeout } from '@/JS/seqDiagramFeaturesVisual'
import { displayFirstUnAckedBar } from '@/JS/seqDiagramFeaturesVisual'
import { clientSendNewAck, serverReceiveNewAck } from '@/JS/nextAckLogic'
import { serverSendSegment, clientReceiveSegment } from '@/JS/nextSegmentLogic'

import {
  events,
  algorithms,
  pendingAcks,
  getLastElem,
  serverState,
  getServerState,
  serverSegments,
  getConfigState,
  setServerState,
  setSessionState,
  getSessionState,
} from '@/JS/session'

function triggerTimeout() {
  //Update server parameters
  setServerState({
    ccState: algorithms.TIMEOUT,
    threshold: Math.max(2, Math.floor(getServerState('congWin') / 2)),
    congWin: 1,
    congWinFractions: 0,
    currentTraffic: 0,
    duplicateAcks: 0,
  })
  setSessionState({
    lastEvent: events.TIMEOUT,
  })
  //Set time to after timeout
  const timeoutSpan =
    getConfigState('timeoutSpan') * getConfigState('roundTripTimeMS')
  const firstUnackedSegmentNum = getServerState('firstUnackedSegmentNum')
  const timestampFirstUnacked =
    serverSegments[firstUnackedSegmentNum].sendingCompleteMS
  const now = timestampFirstUnacked + timeoutSpan
  setSessionState({
    clockMS: now,
  })
  updateDataPanel()
}

export function nextPacket(isDelivered) {
  if (checkTimeoutNow()) {
    triggerTimeout()
    displayTimeout()
    return
  }
  if (isPendingAck()) {
    clientSendNewAck(isDelivered)
    if (isDelivered) serverReceiveNewAck()
    displayNewAck()
  } else if (getServerState('congWin') > getServerState('currentTraffic')) {
    serverSendSegment(isDelivered)
    if (isDelivered) clientReceiveSegment()
    displayNewSegment()
  } else {
    if (checkTimeoutLater()) {
      displayTimeout()
      triggerTimeout()
      return
    }
    
    clientSendNewAck(isDelivered)
    if (isDelivered) serverReceiveNewAck()
    displayNewAck()
  }
  
  displayFirstUnAckedBar()
  updateDataPanel()
}

function checkTimeoutNow() {
  const now = getSessionState('clockMS')
  const timestampFirstUnacked = getServerState('timestampFirstUnacked')
  const timeoutSpan =
    getServerState('timeoutSpan') * getConfigState('roundTripTimeMS')

  return now - timestampFirstUnacked >= timeoutSpan
}

function checkTimeoutLater() {
  if (pendingAcks.length == 0) return true

  const timestampFirstUnacked = getServerState('timestampFirstUnacked')
  const timeoutSpan =
    getServerState('timeoutSpan') * getConfigState('roundTripTimeMS')

  return getLastElem(pendingAcks).endMS - timestampFirstUnacked >= timeoutSpan
}

function isPendingAck() {
  if (pendingAcks.length == 0) return false
  const timeNextAck = getLastElem(pendingAcks).endMS
  return timeNextAck == getSessionState('clockMS')
}

export function setTimestampFirstUnacked(time) {
  const newEntry = { ...getLastElem(serverState) }
  newEntry.timestampFirstUnacked = time
  serverState.push(newEntry)
}
