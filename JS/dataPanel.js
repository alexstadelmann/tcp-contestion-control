function updateDataPanel() {
  document.querySelectorAll('.data').forEach((elem) => {
    // using a const from another file without any contract. This depends on order of the files
    
    elem.value = getLastElem(dynamicServerState)[elem.id]
  })
}
