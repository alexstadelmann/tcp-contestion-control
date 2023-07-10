"use strict"

document.addEventListener("DOMContentLoaded", () => {
  if (!window.matchMedia("(max-width: 999px)").matches) return
  
  document.querySelector("#dropdownMenu").addEventListener("click", switchDropdownMobile)
})

function switchDropdownMobile() {
  if (document.querySelector("#dropdownSpace").style.display == "block") {
    document.getElementsByClassName("visual").forEach((elem) => {
      elem.style.display = elem.id == "seqSpace" || elem.id == "dataSpace"
        ? "block"
        : "none"
    })

    document.getElementsByClassName("tab").forEach((tab) => {
      tab.style["pointer-events"] = "auto"
    })
  } else {
    document.getElementsByClassName("visual").forEach((elem) => {
      elem.style.display = elem.id == "dropdownSpace"
        ? "block"
        : "none"
    })

    document.getElementsByClassName("tab").forEach((tab) => {
      tab.style["pointer-events"] = "none"
    })
  }
}
