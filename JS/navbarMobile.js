document.addEventListener('DOMContentLoaded', () => {
  if (!window.matchMedia('(max-width: 999px)').matches) return

  const spaceByTabId = {
    seqTab: 'seqSpace',
    autoTab: 'autoSpace',
    congTab: 'congwinSpace',
  }
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => displayTab(spaceByTabId[tab.id]))
  })
})

function displayTab(tab) {
  document.querySelectorAll('.visual').forEach((vis) => {
    vis.style.display =
      vis.id == tab || vis.id == 'dataSpace' ? 'block' : 'none'
  })
}
