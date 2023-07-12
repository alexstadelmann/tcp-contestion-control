function trigger3DupplicateAcksEvent() {
  let algorithm = getLastElem(dynamicServerState).ccState
    switch (algorithm) {
      case algorithms.SLOW_START:
        setServerState({
          lastEvent: events.DUP_3,
          ccState: algorithms.FAST_RECOVERY
        })
        break
      case algorithms.CONGESTION_AVOIDANCE:
        setServerState({
          lastEvent: events.DUP_3,
          ccState: algorithms.FAST_RECOVERY
        })
        break
    }
  
  updateDataPanel()
}

function triggerTimeout() {
  const currentCongWin = getLastElem(dynamicServerState).congWin
  //Update server parameters
  setServerState({
    ccState: algorithms.TIMEOUT,
    lastEvent: events.TIMEOUT,
    threshold: Math.min(1, currentCongWin / 2),
    congWin: 1,
    unacked: 0,
    duplicateAcks: 0,
  })
  //Set time to after timeout
  const timeoutSpan = getLastElem(dynamicSettings).timeoutSpan
  const firstUnackedSegmentNum = getLastElem(dynamicServerState).firstUnackedSegmentNum
  const timestampFirstUnacked = dynamicServerSegments[firstUnackedSegmentNum].sendingCompleteMS
  const now = timestampFirstUnacked + timeoutSpan
  setSessionState({
    clockMS: now
  })
  updateDataPanel()
}

function triggerThresholdReachedEvent() {
  let algorithm = getLastElem(dynamicServerState).ccState
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

