'use strict'

document.addEventListener('DOMContentLoaded', function () {
  const taps = document.querySelectorAll('.tap').forEach(function (tap) {
    tap.addEventListener('click', function () {
      activateTap(tap);
      switch (tap.textContent) {
        case 'Sequence':
          activateDiv('seq');
          break;
        case 'Automaton':
          activateDiv('auto');
          break;
        case 'Congestion Window':
          activateDiv('congwin')
          break;
      }
    });
  });
});

function activateDiv(tap) {
  document.querySelectorAll('.visual').forEach( function(vis) {
    if (vis.id == tap) {
      vis.style.display = 'flex';
      // 
      // console.log(vis, vis.classList)
    } else {
      vis.style.display = 'none';
      // vis.classList.remove('active');
      // console.log(vis, vis.classList);
    }
  });
}

function activateTap(tap) {
  document.querySelectorAll('.tap').forEach(function(t) {
    if (t == tap) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  })
}
