function updateDataPanel() {
  document.querySelectorAll('.data').forEach((elem) => {
    
    elem.value = getLastElem(dynamicServerState)[elem.id]
  })
}
