import './style/mobile.sass'
import './style/canvas.sass'
import './style/desktop.sass'
import updateDataPanel from './JS/parameterDisplay'
import displayNewSegment from './JS/nextSegmentVisual'
import resendMissingSegment from './JS/resendSegmentAfterTimeout'
import registerSettingsEvents from './JS/settings'
import renderCongestionDiagram from './JS/congestionDiagram'
import resendMissingSegment3Dup from './JS/resendSegmentAfter3Dup'
import registerNavbarMobileEvents from './JS/navbarMobile'
import regsiterChangeLanguageEvent from './JS/languages'
import registerDropdownMobileEvents from './JS/dropdownMobile'
import registerDropdownDesktopEvents from './JS/dropdownDesktop'
import { nextPacket } from './JS/nextPacketCoordinator'
import { establishTcp } from './JS/tcpMetaLogic'
import { setActiveButtons } from './JS/tcpMetaVisual'
import { clientReceiveSegment } from './JS/nextSegmentLogic'
import { getServerState, algorithms, resetApplication } from './JS/session'

document.addEventListener('DOMContentLoaded', () => {
  setActiveButtons()
  registerSettingsEvents()
  registerNavbarMobileEvents()
  regsiterChangeLanguageEvent()
  registerDropdownMobileEvents()
  registerDropdownDesktopEvents()
  renderCongestionDiagram()
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
  // endButton
})
