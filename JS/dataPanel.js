function updateDataPanel() {
  // using classes for business logic
  document.querySelectorAll('.data').forEach((elem) => {
    // using a const from another file without any contract. This depends on order of the files
    // -1 magic number
    elem.value = getLastElem(dynamicServerState)[elem.id]
  })
}
