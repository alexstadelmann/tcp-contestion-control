"use strict"

document.addEventListener("DOMContentLoaded", () => {
  if (!window.matchMedia("(min-width: 1000px)").matches) {
    return
  }
  document.querySelector("#dropdown_menu").addEventListener("click", () => {
    switchDropdownDesktop()
  })
})

function switchDropdownDesktop() {
  const drop = document.querySelector("#dropdown_space")
  if (drop.style.display == "block") {
    drop.style.display = "none"
  } else {
    drop.style.display = "block"
  }
}
