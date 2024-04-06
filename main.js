import './public/style.css'
import { KLL } from '@kll_/core'
import { CreateComponentPlugin } from '@kll_/basic'
import { TranslatePlugin } from '@kll_/translate'
import { translation } from './data/translation.js'
import { lsKEY } from './ctrl/rupteur.js'

// TRANSLATE ========================
const translateLsKey = '__roller-derby__lang'
localStorage.setItem(translateLsKey, window.navigator.language.split('-')[0])

const params = {
  id: 'app',
  routes: {
    '/': import('./pages/index.html?raw').then((m) => m.default),
    '/about': import('./pages/about.html?raw').then((m) => m.default),
  },
  plugins: [
    CreateComponentPlugin,
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
})

// Prevent the flash of the dark theme
const theme = localStorage.getItem(lsKEY) || 'dark'
if (theme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.add('light')
}
