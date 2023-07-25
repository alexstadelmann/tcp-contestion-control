import { setSettings, resetApplication } from '@/JS/session'

export default function registerSettingsEvents() {
  document.querySelectorAll('form.numeric').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
    })
    form.addEventListener('change', (e) => {
      
      //Each form has only one input
      const newValue = parseInt(form.elements[1].value)
      if (!newValue > 0) return false
      setSettings(form.elements[1].id, newValue)
      resetApplication()
      e.preventDefault()
    })
  })

  document.querySelectorAll('form.string').forEach((form) => {
    form.addEventListener('change', () => {
      const newValue = form.elements.option.value
      setSettings(form.id, newValue)
      resetApplication()
    })
  })
}
