"use strict"

document.addEventListener("DOMContentLoaded", () =>{
  const x = window.matchMedia("(max-width: 999px)")
  if (!x.matches) {
    return
  }
  const tabs = document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", ()=> {
      
      switch (tab.id) {
        case "seq_tab":
          activateDiv("seq_space")
          break
        case "auto_tab":
          activateDiv("auto_space")
          break
        case "cong_tab":
          activateDiv("congwin_space")
          break
      }
    })
  })
})

function activateDiv(tab) {
  document.querySelectorAll(".visual").forEach((vis)=> {
    if (vis.id == tab || vis.id =='data_space') {
      vis.style.display = "block"
    } else {
      vis.style.display = "none"
    }
  })
}
