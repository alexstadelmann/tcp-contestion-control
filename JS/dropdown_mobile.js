"use strict"

document.addEventListener("DOMContentLoaded", function () {
  if (!window.matchMedia("(max-width: 999px)").matches) {
    return
  }
  console.log("A")
  document.querySelector("#mobile_menu").addEventListener("click", () => {
    switchDropdownMobile()
  })
})

function switchDropdownMobile() {
  if (document.querySelector("#dropdown").style.display == "grid") {
    document.querySelectorAll(".visual").forEach((elem) => {
      if (elem.id == "seq") {
        elem.style.display = "flex"
      } else {
        elem.style.display = "none"
      }
    })
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.style["pointer-events"] = "auto"
    })
  } else {
    document.querySelectorAll(".visual").forEach((elem) => {
      if (elem.id == "dropdown") {
        elem.style.display = "grid"
      } else {
        elem.style.display = "none"
      }
    })
    document.querySelectorAll("li.tab").forEach((tab) => {
      tab.style["pointer-events"] = "none"
    })
  }
}
