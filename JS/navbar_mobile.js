'use strict'

document.addEventListener('DOMContentLoaded', function () {
  const x = window.matchMedia("(max-width: 999px)");
  if (!x.matches) {
    return
  }
  const tabs = document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      activateTab(tab);
      switch (tab.textContent) {
        case 'Sequence':
          activateDiv('seq');
          break;
        case 'Automaton':
          activateDiv('auto');
          break;
        case 'Congestion Window':
          activateDiv('congwin');
          break;
      }
    });
  });
});

function activateDiv(tab) {
  document.querySelectorAll('.visual').forEach( function(vis) {
    
    if (vis.id == tab) {
      vis.style.display = 'flex';
    } else {
      vis.style.display = 'none';
    }
  });
}

function activateTab(tab) {
  document.querySelectorAll('.tab').forEach(function(t) {
    if (t == tab) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  })
}
