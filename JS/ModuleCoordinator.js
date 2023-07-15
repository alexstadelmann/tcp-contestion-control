document.addEventListener('DOMContentLoaded', () => {
  updateDataPanel()

  document.querySelector('#send').addEventListener('click', () => {
    let algorithm = getServerState('ccState')
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
        nextPacket(true)
    }
  })
  document.querySelector('#loss').addEventListener('click', () => {
    let algorithm = getServerState('ccState')
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
        nextPacket(false)
    }
  })
  document.querySelector('#startButton').addEventListener('click', establishTcp)
  document.querySelector('#reset').addEventListener('click', resetApplication)
})
