import { switchClasses } from '../utils/switchClasses'

const ATTRS = 'data-menu-open'
const LS = 'kll-' + ATTRS

export const hamburger = {
  onInit() {
    const menu = document.getElementById('menuPanel')
    if (!menu) return
    const open = localStorage.getItem(LS)
    const isOpen = open || window.innerWidth > 640 ? 'true' : 'false'
    menu.setAttribute(ATTRS, isOpen)

    if (window.innerWidth < 640) {
      localStorage.setItem(LS, 'false')
      menu.setAttribute(ATTRS, 'false')
      switchClasses(document.documentElement, 'close', 'open')
      return
    }

    if (isOpen === 'true') {
      switchClasses(document.documentElement, 'open', 'close')
    } else {
      switchClasses(document.documentElement, 'close', 'open')
    }
  },
  onClick() {
    const menu = document.getElementById('menuPanel')
    if (!menu) return
    const newValue = menu.getAttribute(ATTRS) === 'true' ? 'false' : 'true'
    localStorage.setItem(LS, newValue)
    menu.setAttribute(ATTRS, newValue)

    if (newValue === 'true') {
      switchClasses(document.documentElement, 'open', 'close')
    } else {
      switchClasses(document.documentElement, 'close', 'open')
    }
  },
}
