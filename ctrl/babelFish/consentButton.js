import { translation } from '../../data/translation'
import { cookieConsentKey, defaultLang, kll, translateLsKey } from '../../main'
import { openDatabase } from '../../utils/idb'
import { seed } from '../../utils/seed'

export const consentButton = {
  onInit(_, el) {
    const lang = !defaultLang.match(/en|fr|ko/) ? 'en' : defaultLang
    el.innerText = translation.acceptCookie[lang]
  },
  async onClick() {
    localStorage.setItem(cookieConsentKey, 'consent')
    localStorage.setItem(translateLsKey, defaultLang)
    await openDatabase()
    await seed()
    window.history.pushState({}, '', '/')
    kll.injectPage('/')
  },
}
