import { getLastElem, sessionState, getServerState } from './session'

export default function updateDataPanel() {
  document.querySelectorAll('.data').forEach((elem) => {
    if (elem.id == 'congWin') {
      //Special handling of the congestion window to deal with fractions
      const congWinInteger = getServerState('congWin')
      const congWinFractions = getServerState('congWinFractions')
      if (!congWinFractions == 0) {
        elem.value =
          congWinInteger + ' ' + congWinFractions + '/' + congWinInteger
      } else {
        elem.value = congWinInteger
      }
    } else {
      elem.value = getServerState(elem.id)
    }
  })
  document.querySelectorAll('.sessionData').forEach((elem) => {
    elem.value = getLastElem(sessionState)[elem.id]
  })
}
