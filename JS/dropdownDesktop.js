document.addEventListener('DOMContentLoaded', () => {
  if (!window.matchMedia('(min-width: 1000px)').matches) return

  document
    .querySelector('#dropdownMenu')
    .addEventListener('click', switchDropdownDesktop)
  document
    .querySelector('#extendedData')
    .addEventListener('click', switchExtendedData)
})

function switchDropdownDesktop() {
  const dropdownElement = document.querySelector('#dropdownSpace')
  dropdownElement.style.display =
    dropdownElement.style.display == 'block' ? 'none' : 'block'
}

function switchExtendedData() {
  const extendedDataElement = document.querySelector('#extendedDataSpace')
  extendedDataElement.style.display =
    extendedDataElement.style.display == 'block' ? 'none' : 'block'
}
