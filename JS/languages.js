"use strict"

var lang_dictionary = {
  text0: {
    en: "TCP-Congestion-Control",
    de: "TCP Staukontrolle",
  },
  text1: {
    en: "TCP version:",
    de: "TCP Version:",
  },
  text3: {
    en: "Round Trip Delay in ms:",
    de: "Round Trip Delay in ms:",
  },
  text4: {
    en: "Transmission Rate in kByte/s:",
    de: "Übertragungsrate in kByte/s:",
  },
  seq_tab: {
    en: "Sequence",
    de: "Sequenz",
  },
  auto_tab: {
    en: "Automaton",
    de: "Automat",
  },
  cong_tab: {
    en: "Congestion Window",
    de: "Staufenster",
  },
  text8: {
    en: "Congestion Control Algorithm",
    de: "Algorithmus für Staukontrolle",
  },
  text9: {
    en: "Segment Size in Byte",
    de: "Segmentgröße in Byte",
  },
  text10: {
    en: "Initial Threshold",
    de: "Initialer Threshold",
  },
  text11: {
    en: "English",
    de: "Englisch",
  },
  text12: {
    en: "German",
    de: "Deutsch",
  },
  text13: {
    en: "Language",
    de: "Sprache",
  },

  desktop_menu: {
    en: "Configuration",
    de: "Einstellungen",
  },
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("form.string").forEach((form) => {
    form.addEventListener("change", () => {
      const newValue = form.elements.option.value

      if (newValue == "en") {
        setLang("en")
      } else if (newValue == "de") {
        setLang("de")
      }

      return false
    })
  })
})

function setLang(lang) {
  document.querySelectorAll(".lang").forEach((elem) => {
    elem.innerHTML = lang_dictionary[elem.id][lang]
  })
}

// obj.innerHTML = dict[obj.id]['de'];
// // Change language to german
