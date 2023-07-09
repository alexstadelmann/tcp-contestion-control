"use strict"

document.addEventListener("DOMContentLoaded", () => {
  if (!window.matchMedia("(max-width: 999px)").matches) return

  const spaceByTabId = {
    seq_tab: "seq_space",
    auto_tab: "auto_space",
    cong_tab: "congwin_space"
  }

  document.getElementsByClassName("tab").forEach((tab) => {
    tab.addEventListener("click", () => displayTab(spaceByTabId[tab.id]))
  })
})

function displayTab(tab) {
  document.getElementsByClassName("visual").forEach((vis)=> {
    vis.style.display = vis.id == tab || vis.id == "data_space"
      ? "block"
      : "none"
  })
}
