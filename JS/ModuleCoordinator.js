document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#send').addEventListener('click',()=> {
    let algorithm = getLastElem(dynamicServerState).ccState
    switch (algorithm) {
      case algorithms.SLOW_START:
        sendSlowStart(true)
        break
      case algorithms.TIMEOUT:
        resendMissingSegment(true)
        clientReceiveSegment()
        displayNewSegment()
        break
      case algorithms.CONGESTION_AVOIDANCE:
        sendCongestionAvoidance(true)
        break
      case algorithms.FAST_RECOVERY:
        sendFastRecovery(true)
    }
    
  })
  document.querySelector('#loss').addEventListener('click', ()=> {
    let algorithm = getLastElem(dynamicServerState).ccState
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
})

