function updateDataPanel() {
  document.querySelectorAll('.data').forEach((elem) => {

    
    if (elem.id == 'congWin') {
      //Special handling of the congestion window to deal with fractions
      const congWinInteger = getLastElem(dynamicServerAndSessionState).congWin
      const congWinFractions = getLastElem(dynamicServerAndSessionState).congWinFractions
      if (!congWinFractions == 0) {
        elem.value = congWinInteger + ' ' + congWinFractions + '/' + congWinInteger
      } else {
        elem.value = congWinInteger
      }
    } else {
      elem.value = getLastElem(dynamicServerAndSessionState)[elem.id]
    }
    
  })
  document.querySelectorAll('.sessionData').forEach((elem) => {
    elem.value = getLastElem(dynamicSessionState)[elem.id]
  })
}
