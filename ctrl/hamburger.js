const ATTRS = 'data-menu-open'
const LS = 'kll-' + ATTRS

export const hamburger = {
  onInit() {
    const menu = document.getElementById('menuPanel')
    if (!menu) return
    const open = localStorage.getItem(LS)
    menu.setAttribute(
      ATTRS,
      open ? open : window.innerWidth > 640 ? 'true' : 'false'
    )
  },
  onClick() {
    const menu = document.getElementById('menuPanel')
    if (!menu) return
    const newValue = menu.getAttribute(ATTRS) === 'true' ? 'false' : 'true'
    localStorage.setItem(LS, newValue)
    menu.setAttribute(ATTRS, newValue)
  },
}
