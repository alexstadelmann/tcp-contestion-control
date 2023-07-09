"use strict"

document.addEventListener("DOMContentLoaded", () => {
  if (!window.matchMedia("(min-width: 1000px)").matches) return

  document.querySelector("#dropdown_menu").addEventListener("click", () => {
    switchDropdownDesktop()
  })
})

function switchDropdownDesktop() {
  const dropdownElement = document.getElementById("dropdown_space")
  dropdownElement.style.display = dropdownElement.style.display == "block"
    ? "none"
    : "block"
}
