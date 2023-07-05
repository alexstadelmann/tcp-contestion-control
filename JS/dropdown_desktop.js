"use strict"

document.addEventListener("DOMContentLoaded", () => {
  if (!window.matchMedia("(min-width: 1000px)").matches) {
    return
  }
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      switchDropdownDesktop()
    })
  })
})
function switchDropdownDesktop() {
  const drop = document.querySelector("#dropdown")
  if (drop.style.display == "grid") {
    drop.style.display = "none"
  } else {
    drop.style.display = "grid"
  }
}
