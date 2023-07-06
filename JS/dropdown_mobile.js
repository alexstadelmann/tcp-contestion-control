"use strict"

document.addEventListener("DOMContentLoaded", function () {
  if (!window.matchMedia("(max-width: 999px)").matches) {
    return
  }
  
  document.querySelector("#dropdown_menu").addEventListener("click", () => {
    switchDropdownMobile()
  })
})

function switchDropdownMobile() {
  if (document.querySelector("#dropdown_space").style.display == "block") {
    document.querySelectorAll(".visual").forEach((elem) => {
      if (elem.id == "seq_space" || elem.id == 'data_space') {
        elem.style.display = "block"
      } else {
        elem.style.display = "none"
      }
    })
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.style["pointer-events"] = "auto"
    })
  } else {
    document.querySelectorAll(".visual").forEach((elem) => {
      if (elem.id == "dropdown_space") {
        elem.style.display = "block"
      } else {
        elem.style.display = "none"
      }
    })
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.style["pointer-events"] = "none"
    })
  }
}
