"use strict"

// use templates and meaningful variable names instead of ids
const langDictionary = {
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
  seqTab: {
    en: "Sequence",
    de: "Sequenz",
  },
  autoTab: {
    en: "Automaton",
    de: "Automat",
  },
  congTab: {
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

  desktopMenu: {
    en: "Configuration",
    de: "Einstellungen",
  },
}

document.addEventListener("DOMContentLoaded", () => {

  document.querySelector("#changeLang").addEventListener("change", (event) => {
    console.log(event)
    const newValue = event.target.value
    setLang(newValue)
  
  })
})

function setLang(lang) {
  document.querySelectorAll(".lang").forEach((elem) => {
    console.log(langDictionary[elem.id][lang])
    elem.innerHTML = langDictionary[elem.id][lang]
  })
}

