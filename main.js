import './public/style.css'
import { KLL } from '@kll_/core'
import {
  CreateComponentPlugin,
  ManageAttrsPlugin,
  SmartRenderPlugin,
} from '@kll_/basic'
import { TranslatePlugin } from '@kll_/translate'
import { translation } from './data/translation.js'
import { lsKEY } from './ctrl/rupteur.js'

// TRANSLATE ========================
export const defaultLang = window.navigator.language.split('-')[0]
export const translateLsKey = '__kazerlelutin__lang'
localStorage.setItem(translateLsKey, window.navigator.language.split('-')[0])

// BABELFISH ========================
export const defaultLangWordKey = '__kllbalelfish__defaultLangWord'
export const cookieConsentKey = '__kllbalelfish__cookieConsent'

if (localStorage.getItem(cookieConsentKey) === 'consent')
  localStorage.setItem(translateLsKey, defaultLang)

const params = {
  id: 'app',
  routes: {
    '/': import('./pages/index.html?raw').then((m) => m.default),
    '/about': import('./pages/about.html?raw').then((m) => m.default),
    '/legal': import('./pages/legal.html?raw').then((m) => m.default),
    '/category/:category': import('./pages/category.html?raw').then(
      (m) => m.default
    ),
    '/category/:category/:section': import('./pages/sections.html?raw').then(
      (m) => m.default
    ),
    '/ressource/:category/:section/:name': import(
      './pages/ressource.html?raw'
    ).then((m) => m.default),
    '/consent': import('./pages/consent.html?raw').then((m) => m.default),

    // BABELFISH

    '/babelfish': import('./pages/babelfish/index.html?raw').then(
      (m) => m.default
    ),
    '/babelfish-sync': import('./pages/babelfish/sync.html?raw').then(
      (m) => m.default
    ),

    '/babelfish-words': import('./pages/babelfish/words.html?raw').then(
      (m) => m.default
    ),

    '/babelfish-docs': import('./pages/babelfish/docs.html?raw').then(
      (m) => m.default
    ),
    '/babelfish-doc/:id': import('./pages/babelfish/index.html?raw').then(
      (m) => m.default
    ),
  },
  plugins: [
    CreateComponentPlugin,
    SmartRenderPlugin,
    ManageAttrsPlugin,
    (kll) => new TranslatePlugin(kll, translation, translateLsKey),
  ],
}

if (import.meta.env.MODE === 'development') {
  params.ctrlPath = import('./ctrl/index.js').then((m) => m)
  params.templatePath = import('./templates/index.js').then((m) => m)
} else {
  params.ctrlPath = import('/ctrl/index.js').then((m) => m)
  params.templatePath = import('/templates/index.js').then((m) => m)
}

export const kll = new KLL(params)

addEventListener('DOMContentLoaded', () => {
  kll.plugins.translate()
  if (localStorage.getItem(cookieConsentKey) !== 'consent') {
    window.history.pushState({}, '', '/consent')
    kll.injectPage('/consent')
  }
})

// Prevent the flash of the dark theme
const theme = localStorage.getItem(lsKEY) || 'dark'
if (theme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.add('light')
}
