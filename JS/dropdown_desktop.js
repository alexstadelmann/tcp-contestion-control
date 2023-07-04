'use strict'

document.addEventListener('DOMContentLoaded', function () {
  const x = window.matchMedia("(min-width: 1000px)");
  const tabs = document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      if (tab.textContent == '≡') {
        
        if (x.matches) {
          switchDropdownDesktop();
        } else {
          switchDropdownMobile();
        }
        
      }
    });
  });
});
function switchDropdownDesktop() {
  const drop = document.querySelector('#dropdown')
  if (drop.style.display == 'grid') {
    drop.style.display = 'none'
  } else {
    drop.style.display = 'grid'
  }
}

function switchDropdownMobile(tab) {
  const drop = document.querySelector('#dropdown')
  if (drop.style.display == 'grid') {
    document.querySelectorAll('.visual').forEach( function(vis) {
      
  
      if (vis.id == 'seq') {
        vis.style.display = 'flex';
      } else {
        vis.style.display = 'none';
      }
    });
    document.querySelectorAll('li.tab').forEach ( (tab) => {
      tab.style['pointer-events'] = 'auto';
    })
  } else {
    document.querySelectorAll('.visual').forEach( function(vis) {
      
  
      if (vis.id == 'dropdown') {
        vis.style.display = 'grid';
      } else {
        vis.style.display = 'none';
      }
    });
    document.querySelectorAll('li.tab').forEach ( (tab) => {
      tab.style['pointer-events'] = 'none';
    })
  }

  
}
