import { switchClasses } from '../utils/switchClasses.js'
import { kll } from '../main'

const classForActive = ['border-rd-sagwa_old']
const classForInactive = ['border-transparent']

export const tabs = {
  state: {
    active: '',
    tabs: [],
  },
  onInit(state, el) {
    const active = el.getAttribute('data-active')
    if (active) state.active = active
    const nav = el.querySelector('nav')

    const tabs = el.querySelectorAll('[data-tabs]')

    if (!state.active && state.tabs.length >= 1) state.active = state.tabs[0]

    tabs.forEach((tab) => {
      const tabName = tab.getAttribute('data-tabs')
      if (state.tabs.includes(tabName)) return

      //TODO créer un template pour les tab et passer les infos en attribut

      const tabNav = document.createElement('button')

      tabNav.addEventListener('click', () => {
        state.active = tabName
        el.render()
      })

      tabNav.classList.add('border-b-2', 'border-transparent', 'uppercase')
      nav.appendChild(tabNav)
      tabNav.setAttribute('data-name', tabName)
      tabNav.setAttribute('data-trans', tabName)
      state.tabs.push(tabName)
    })

    kll.plugins.translate(el)
    el.render()
  },
  render(state, el) {
    const nav = el.querySelector('nav')
    const tabsNav = nav.querySelectorAll('button')
    tabsNav.forEach((tab) => {
      const tabName = tab.getAttribute('data-name')

      if (state.active === tabName) {
        switchClasses(tab, classForActive, classForInactive)
      } else {
        switchClasses(tab, classForInactive, classForActive)
      }
    })

    const tabs = el.querySelectorAll('[data-tabs]')
    tabs.forEach((tab) => {
      const tabName = tab.getAttribute('data-tabs')
      if (state.active === tabName) {
        tab.style.display = 'block'
      } else {
        tab.style.display = 'none'
      }
    })
  },
}
