'use strict'

document.addEventListener('DOMContentLoaded', function () {
  const basic_settings = {
    0: {
      version: 'tahoe',
      rtt_ms: 200,
      segsize_byte: 500,
      transrate_kbyte_per_second: 20,
      initial_threshold: 10,
      lang: 'en'
    }
  }

  const dinamic_settings = {...basic_settings}
  console.log(dinamic_settings)

  
  document.querySelectorAll('form.numeric').forEach( (form) => {
    
    form.onsubmit = () => {
  
      //Each form has only one input
      var newValue = parseInt(form.elements[1].value);


      // Validate that input is a positive integer
      if (!newValue || newValue < 0) {
        return false;
      }

      setNewEntry(form.id, newValue);
     
      return false; 
    };
  });

  document.querySelectorAll('form.string').forEach( (form) => {
    form.onchange = () => {
      const newValue = form.elements.option.value;
      setNewEntry(form.id, newValue);
      
      return false; 
    };
  });

  function setNewEntry(key, newValue ) {
    let highest = highest_entry(dinamic_settings);
      const new_entry= {...dinamic_settings[highest]};
      new_entry[key] = newValue;
      dinamic_settings[highest + 1] = new_entry
      console.log(dinamic_settings)
  }
  function highest_entry(dict) {
    const key_list_str = Object.keys(dict);
    const key_list_int= key_list_str.map(x => parseInt(x));
    
    return Math.max(...key_list_int)
  }
});