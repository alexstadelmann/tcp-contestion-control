'use strict'

function update_data_panel() {
  document.querySelectorAll('.data').forEach((elem) => {
  elem.value=dynamic_server_state.at(-1)[elem.id]
  })
}
