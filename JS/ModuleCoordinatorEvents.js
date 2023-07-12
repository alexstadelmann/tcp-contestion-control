function trigger3DupplicateAcksEvent() {
  let algorithm = getLastElem(dynamicServerAndSessionState).ccState
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
  const currentCongWin = getLastElem(dynamicServerAndSessionState).congWin
  console.log
  //Update server parameters
  setServerState({
    ccState: algorithms.TIMEOUT,
    lastEvent: events.TIMEOUT,
    threshold: Math.max(1, Math.floor(currentCongWin / 2)),
    congWin: 1,
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

