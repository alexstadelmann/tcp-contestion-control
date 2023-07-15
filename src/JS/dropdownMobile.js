export default function registerDropdownMobileEvents() {
  if (!window.matchMedia('(max-width: 999px)').matches) return

  document
    .querySelector('#dropdownMenu')
    .addEventListener('click', switchDropdownMobile)
}

function switchDropdownMobile() {
  if (document.querySelector('#dropdownSpace').style.display == 'block') {
    document.querySelectorAll('.visual').forEach((elem) => {
      elem.style.display =
        elem.id == 'seqSpace' || elem.id == 'dataSpace' ? 'block' : 'none'
    })

    document.querySelectorAll('.tab').forEach((tab) => {
      tab.style['pointer-events'] = 'auto'
    })
  } else {
    document.querySelectorAll('.visual').forEach((elem) => {
      elem.style.display = elem.id == 'dropdownSpace' ? 'block' : 'none'
    })

    document.querySelectorAll('.tab').forEach((tab) => {
      tab.style['pointer-events'] = 'none'
    })
  }
}
