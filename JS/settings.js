"use strict"
const basic_settings = {
  version: "tahoe",
  rtt_ms: 200,
  segsize_byte: 500,
  transrate_kbyte_per_second: 20,
  initial_threshold: 10,
  lang: "en",
  tcp_state: 'listen',
  cc_state: 'slowStart',
  
}
export const dinamic_settings = [{...basic_settings}]

document.addEventListener("DOMContentLoaded", function () {
   const basic_settings = {
    version: "tahoe",
    rtt_ms: 200,
    segsize_byte: 500,
    transrate_kbyte_per_second: 20,
    initial_threshold: 10,
    lang: "en",
  }

  
  
  console.log(dinamic_settings[0])

  document.querySelectorAll("form.numeric").forEach((form) => {
    form.addEventListener('submit', (e) => {
      //Each form has only one input
      const newValue = parseInt(form.elements[1].value)

      // Validate that input is a positive integer
      if (!newValue || newValue < 0) {
        return false
      }

      setNewEntry(form.id, newValue)
      console.log(dinamic_settings)

      e.preventDefault()
    })
  })

  document.querySelectorAll("form.string").forEach((form) => {
    form.addEventListener('change', () => {
      const newValue = form.elements.option.value
      setNewEntry(form.id, newValue)
      console.log(dinamic_settings)

      return false
    })
  })
  function setNewEntry(key, newValue) {
    const new_entry = {...dinamic_settings[0]}
    new_entry[key] = newValue
    dinamic_settings.unshift(new_entry)
    
    
  }

})






