"use strict"

document.addEventListener("DOMContentLoaded", () => {
  if (!window.matchMedia("(min-width: 1000px)").matches) return

  document.querySelector("#dropdownMenu").addEventListener("click", () => {
    switchDropdownDesktop()
  })
})

function switchDropdownDesktop() {
  const dropdownElement = document.querySelector("#dropdownSpace")
  dropdownElement.style.display = dropdownElement.style.display == "block"
    ? "none"
    : "block"
}
