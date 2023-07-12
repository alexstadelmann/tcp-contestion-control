document.addEventListener('DOMContentLoaded', () => {
  updateDataPanel()
  document.querySelector('#send').addEventListener('click',()=> {
    let algorithm = getLastElem(dynamicServerAndSessionState).ccState
    switch (algorithm) {
      case algorithms.SLOW_START:
        nextSlowStart(true)
        break
      case algorithms.TIMEOUT:
        resendMissingSegment(true)
        clientReceiveSegment()
        displayNewSegment()
        break
      case algorithms.CONGESTION_AVOIDANCE:
        nextCongestionAvoidance(true)
        break
      case algorithms.FAST_RECOVERY:
        sendFastRecovery(true)
    }
    
  })
  document.querySelector('#loss').addEventListener('click', ()=> {
    let algorithm = getLastElem(dynamicServerAndSessionState).ccState
    switch (algorithm) {
      case algorithms.SLOW_START:
        sendSlowStart(false)
        break
      case algorithms.TIMEOUT:
        resendMissingSegment(false)
        break
      case algorithms.CONGESTION_AVOIDANCE:
        sendCongestionAvoidance(false)
        break
      case algorithms.FAST_RECOVERY:
        sendFastRecovery(false)
    }
    
  })
  document.querySelector('#startButton').addEventListener('click', establishTcp)
  document.querySelector('#reset').addEventListener('click', resetApplication)
  
})

