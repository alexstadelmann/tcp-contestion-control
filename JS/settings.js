"use strict"
const basic_settings = {
  version: "tahoe",
  rtt_ms: 200,
  segsize_byte: 500,
  transrate_kbyte_per_second: 20,
  initial_threshold: 10,
  lang: "en",
  

}
const dynamic_settings = [{...basic_settings}]


document.addEventListener("DOMContentLoaded", function () {
  
  

  document.querySelectorAll("form.numeric").forEach((form) => {
    form.addEventListener('submit', (e) => {
      //Each form has only one input
      const newValue = parseInt(form.elements[1].value)

      // Validate that input is a positive integer
      if (!newValue || newValue < 0) {
        return false
      }

      setNewEntrySettings(form.id, newValue)
      e.preventDefault(dynamic_settings)
    })
  })

  document.querySelectorAll("form.string").forEach((form) => {
    form.addEventListener('change', () => {
      const newValue = form.elements.option.value
      setNewEntrySettings(form.id, newValue)
      

      return false
    })
  })
  function setNewEntrySettings(key, newValue) {
    const newEntrySettings = {...dynamic_settings.at(-1)}
    newEntrySettings[key] = newValue
    dynamic_settings.push(newEntrySettings)
  }

})






