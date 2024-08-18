import { kll } from '../main.js'
import { displayReturnBtn } from '../utils/displayReturnBtn.js'

export const link = {
  async onClick(_, el, e) {
    e.preventDefault()
    const path = el.getAttribute('href')
    window.history.pushState({}, '', path)
    await kll.injectPage(path)

    const menu = document.getElementById('menuPanel')
    if (!menu) return

    displayReturnBtn()
  },
}
