function trigger3DupplicateAcksEvent() {
  let algorithm = getLastElem(dynamicServerAndSessionState).ccState

  console.log('threshold:', getLastElem(dynamicServerAndSessionState).congWin / 2)
    
    console.log('congWin:', getLastElem(dynamicServerAndSessionState).congWin / 2 + 3,)
  setServerState({
    ccState: algorithms.DUP_3,
    threshold: getLastElem(dynamicServerAndSessionState).congWin / 2,
    congWin: getLastElem(dynamicServerAndSessionState).congWin / 2 + 3,
    congWinFractions: 0,
  })
  setSessionState({
    lastEvent: events.DUP_3,
  })
  
  updateDataPanel()
}

function triggerTimeout() {
  const currentCongWin = getLastElem(dynamicServerAndSessionState).congWin
  console.log
  //Update server parameters
  setServerState({
    ccState: algorithms.TIMEOUT,
    threshold: Math.max(1, Math.floor(currentCongWin / 2)),
    congWin: 1,
    congWinFractions: 0,
    currentTraffic: 0,
    duplicateAcks: 0,
  })
  setSessionState({
    lastEvent: events.TIMEOUT,
  })
  //Set time to after timeout
  const timeoutSpan = getLastElem(dynamicSettings).timeoutSpan
  const firstUnackedSegmentNum = getLastElem(dynamicServerAndSessionState).firstUnackedSegmentNum
  const timestampFirstUnacked = dynamicServerSegments[firstUnackedSegmentNum].sendingCompleteMS
  const now = timestampFirstUnacked + timeoutSpan
  setSessionState({
    clockMS: now
  })
  updateDataPanel()
}

function triggerThresholdEvent() {
  let algorithm = getLastElem(dynamicServerAndSessionState).ccState
  switch (algorithm) {
    case algorithms.SLOW_START:
      setServerState({
        ccState: algorithms.CONGESTION_AVOIDANCE
      })
      setSessionState({
        lastEvent: events.THRESHOLD_REACHED,
      })
      break     
    case algorithms.FAST_RECOVERY:
      setServerState({
        ccState: algorithms.SLOW_START
      })
      setSessionState({
        lastEvent: events.TIMEOUT,
      })
      break
  }
}

