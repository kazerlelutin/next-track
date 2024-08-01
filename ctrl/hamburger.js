import { switchClasses } from '../utils/switchClasses'

export const hamburger = {
  onClick() {
    const menu = document.getElementById('menu-desktop')
    if (!menu) return
    const classes = menu.classList

    if (classes.contains('-left-full'))
      switchClasses(menu, 'left-0', '-left-full')
    else switchClasses(menu, '-left-full', 'left-0')
  },
}
