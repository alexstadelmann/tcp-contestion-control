document.addEventListener('DOMContentLoaded', () => {
  updateDataPanel()
  document.querySelector('#send').addEventListener('click',()=> {
    let algorithm = getLastElem(dynamicServerAndSessionState).ccState
    switch (algorithm) {
      case algorithms.SLOW_START:
        nextPacket(true)
        break
      case algorithms.TIMEOUT:
        resendMissingSegment(true)
        clientReceiveSegment()
        displayNewSegment()
        break
      case algorithms.DUP_3:
        resendMissingSegment3Dup(true)
        clientReceiveSegment()
        displayNewSegment()
        break
      case algorithms.CONGESTION_AVOIDANCE:
        nextPacket(true)
        break
      case algorithms.FAST_RECOVERY:
        sendFastRecovery(true)
    }
    
  })
  document.querySelector('#loss').addEventListener('click', ()=> {
    let algorithm = getLastElem(dynamicServerAndSessionState).ccState
    switch (algorithm) {
      case algorithms.SLOW_START:
        nextPacket(false)
        break
      case algorithms.TIMEOUT:
        resendMissingSegment(false)
        displayNewSegment()
        break
      case algorithms.DUP_3:
        resendMissingSegment3Dup(true)
        clientReceiveSegment()
        displayNewSegment()
        break
      case algorithms.CONGESTION_AVOIDANCE:
        nextPacket(false)
        break
      case algorithms.FAST_RECOVERY:
        nextFastRecovery(false)
    }
    
  })
  document.querySelector('#startButton').addEventListener('click', establishTcp)
  document.querySelector('#reset').addEventListener('click', resetApplication)
  
})

