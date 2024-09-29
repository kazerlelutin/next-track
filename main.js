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
    '/sync': import('./pages/sync.html?raw').then((m) => m.default),
    '/sync-up': import('./pages/syncup.html?raw').then((m) => m.default),
    '/sync-down': import('./pages/syncdown.html?raw').then((m) => m.default),
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

addEventListener('DOMContentLoaded', async () => {
  const app = document.querySelector('#app')

  // No available on start of the app
  app.sub = () => {}
  app.trigger = (_room, _msg) => {}

  kll.plugins.translate()
  if (localStorage.getItem(cookieConsentKey) !== 'consent') {
    window.history.pushState({}, '', '/consent')
    kll.injectPage('/consent')
  }

  // ===== WEBSOCKET =====
  const url =
    import.meta.env.MODE === 'development'
      ? 'ws://localhost:3000'
      : `wss://${window.location.host}/api/ws`

  const websocket = new WebSocket(url)

  websocket.addEventListener('open', () => {
    console.log('WebSocket connection opened')
    app._socket = websocket
  })

  function subHandler(channel, event, handler) {
    const data = JSON.parse(event.data || '{}')
    if (!data?.channel) return
    if (data.channel === channel) handler(data?.msg)
  }

  app.sub = (channel, handler) => {
    websocket.addEventListener('message', (e) =>
      subHandler(channel, e, handler)
    )
  }

  app.unSub = (channel) => {
    websocket.removeEventListener('message', () => subHandler(channel))
  }

  app.trigger = (channel, msg) => {
    websocket.send(JSON.stringify({ channel, msg }))
  }
})

// Prevent the flash of the dark theme
const theme = localStorage.getItem(lsKEY) || 'dark'
if (theme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.add('light')
}
