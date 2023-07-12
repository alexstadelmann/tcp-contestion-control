function trigger3DupplicateAcksEvent() {
  let algorithm = getLastElem(dynamicServerAndSessionState).ccState

  console.log('threshold:', getLastElem(dynamicServerAndSessionState).congWin / 2)
    
    console.log('congWin:', getLastElem(dynamicServerAndSessionState).congWin / 2 + 3,)
  setServerState({
    lastEvent: events.DUP_3,
    ccState: algorithms.DUP_3,
    threshold: getLastElem(dynamicServerAndSessionState).congWin / 2,
    congWin: getLastElem(dynamicServerAndSessionState).congWin / 2 + 3,
    congWinFractions: 0,
    
  })
  
  updateDataPanel()
}

function triggerTimeout() {
  const currentCongWin = getLastElem(dynamicServerAndSessionState).congWin
  console.log
  //Update server parameters
  setServerState({
    ccState: algorithms.TIMEOUT,
    lastEvent: events.TIMEOUT,
    threshold: Math.max(1, Math.floor(currentCongWin / 2)),
    congWin: 1,
    congWinFractions: 0,
    unacked: 0,
    duplicateAcks: 0,
  })
  //Set time to after timeout
  const timeoutSpan = getLastElem(dynamicSettings).timeoutSpan
  const firstUnackedSegmentNum = getLastElem(dynamicServerAndSessionState).firstUnackedSegmentNum
  const timestampFirstUnacked = dynamicServerSegments[firstUnackedSegmentNum].sendingCompleteMS
  const now = timestampFirstUnacked + timeoutSpan
  setServerState({
    clockMS: now
  })
  updateDataPanel()
}

function triggerThresholdEvent() {
  let algorithm = getLastElem(dynamicServerAndSessionState).ccState
  switch (algorithm) {
    case algorithms.SLOW_START:
      setServerState({
        lastEvent: events.THRESHOLD_REACHED,
        ccState: algorithms.CONGESTION_AVOIDANCE
      })
      break     
    case algorithms.FAST_RECOVERY:
      setServerState({
        lastEvent: events.TIMEOUT,
        ccState: algorithms.SLOW_START
      })
      break
  }
}

