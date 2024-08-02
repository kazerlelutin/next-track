import { langs } from '../../data/langs'
import { defaultLangWordKey } from '../../main'

export const langSelector = {
  state: {
    defaultvalue: undefined,
  },
  onInit(state, el) {
    const opts = Object.keys(langs)
      .map((lang) => ({ value: lang, text: langs[lang] }))
      .sort((a, b) => a.text.localeCompare(b.text))

    for (const opt of opts) {
      const option = document.createElement('option')
      option.value = opt.value
      option.textContent = opt.text
      if (opt.value === state.defaultvalue) option.selected = true
      el.appendChild(option)
    }
  },
  onChange(_, el) {
    localStorage.setItem(defaultLangWordKey, el.value)
  },
}
