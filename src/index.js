import '@/style/mobile.sass'
import '@/style/canvas.sass'
import '@/style/desktop.sass'
import updateDataPanel from '@/JS/parameterDisplay'
import registerSettingsEvents from '@/JS/settings'
import renderCongestionDiagram from '@/JS/congestionDiagram'
import registerNavbarMobileEvents from '@/JS/navbarMobile'
import registerDemoSequenceEvents from '@/JS/demoSequence'
import regsiterChangeLanguageEvent from '@/JS/languages'
import registerDropdownMobileEvents from '@/JS/dropdownMobile'
import registerDropdownDesktopEvents from '@/JS/dropdownDesktop'
import {
  setActiveButtons,
  registerControlButtonsEvents,
} from '@/JS/controlButtons'

const init = () => {
  setActiveButtons()
  registerSettingsEvents()
  registerNavbarMobileEvents()
  regsiterChangeLanguageEvent()
  registerDropdownMobileEvents()
  registerDropdownDesktopEvents()
  registerDemoSequenceEvents()
  renderCongestionDiagram()
  updateDataPanel()
  registerControlButtonsEvents()
}

document.addEventListener('DOMContentLoaded', init)
