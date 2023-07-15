// use templates and meaningful variable names instead of ids
const langDictionary = {
  textTcpCongestionControl: {
    en: 'TCP-Congestion-Control',
    de: 'TCP Staukontrolle',
  },
  textRoundTripDelay: {
    en: 'Round Trip Delay in ms:',
    de: 'Round Trip Delay in ms:',
  },
  textTransmissionRate: {
    en: 'Transmission Rate in kByte/s:',
    de: 'Übertragungsrate in kByte/s:',
  },
  seqTab: {
    en: 'Sequence',
    de: 'Sequenz',
  },
  autoTab: {
    en: 'Automaton',
    de: 'Automat',
  },
  congTab: {
    en: 'Congestion Window',
    de: 'Staufenster',
  },
  textCongestionControlAlg: {
    en: 'Congestion Control Algorithm',
    de: 'Algorithmus für Staukontrolle',
  },
  textSegmentSize: {
    en: 'Segment Size in Byte',
    de: 'Segmentgröße in Byte',
  },
  textInitialThreshold: {
    en: 'Initial Threshold',
    de: 'Initialer Threshold',
  },
  textEnglish: {
    en: 'English',
    de: 'Englisch',
  },
  textGerman: {
    en: 'German',
    de: 'Deutsch',
  },
  textLanguage: {
    en: 'Language',
    de: 'Sprache',
  },

  desktopMenu: {
    en: 'Configuration',
    de: 'Einstellungen',
  },
}

export default function regsiterChangeLanguageEvent() {
  document.querySelector('#changeLang').addEventListener('change', (event) => {
    const newValue = event.target.value
    setLang(newValue)
  })
}

function setLang(lang) {
  document.querySelectorAll('.lang').forEach((elem) => {
    elem.innerHTML = langDictionary[elem.id][lang]
  })
}
