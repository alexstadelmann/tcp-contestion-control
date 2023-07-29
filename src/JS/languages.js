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
  textTcpState: {
    en: 'TCP State:',
    de: 'TCP Status:',
  },
  textCcState: {
    en: 'CC State:',
    de: 'CC Status:',
  },
  textTimeout: {
    en: 'Timeout Span in MSS',
    de: 'Timeout Zeitspanne in MSS',
  },
  textCongWin: {
    en: 'Congestion<br/>Window:',
    de: 'Staufenster:',
  },
  textCurrentTraffic: {
    en: 'Current<br/>Traffic:',
    de: 'Aktueller<br/>Verkehr:',
  },
  textRound: {
    en: 'Round:',
    de: 'Runde',
  },
  textThreshold: {
    en: 'Threshold:',
    de: 'Übergangsschwelle:',
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
    console.log(elem)
    elem.innerHTML = langDictionary[elem.id][lang]
  })
}
