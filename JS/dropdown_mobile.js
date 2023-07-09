"use strict"

document.addEventListener("DOMContentLoaded", () => {
  if (!window.matchMedia("(max-width: 999px)").matches) return
  
  document.querySelector("#dropdown_menu").addEventListener("click", () => {
    switchDropdownMobile()
  })
})

function switchDropdownMobile() {
  if (document.querySelector("#dropdown_space").style.display == "block") {
    document.getElementsByClassName("visual").forEach((elem) => {
      elem.style.display = elem.id == "seq_space" || elem.id == "data_space"
        ? "block"
        : "none"
    })

    document.getElementsByClassName("tab").forEach((tab) => {
      tab.style["pointer-events"] = "auto"
    })
  } else {
    document.getElementsByClassName("visual").forEach((elem) => {
      elem.style.display = elem.id == "dropdown_space"
        ? "block"
        : "none"
    })

    document.getElementsByClassName("tab").forEach((tab) => {
      tab.style["pointer-events"] = "none"
    })
  }
}
