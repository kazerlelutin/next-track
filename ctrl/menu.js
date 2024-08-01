import { switchClasses } from '../utils/switchClasses'

export const menu = {
  state: {
    resizeObs: undefined,
    ismobile: false,
  },
  onInit(state, el) {
    const resize = () => {
      const ismobile = window.innerWidth < 764
      if (ismobile === state.ismobile) return
      state.ismobile = ismobile
      el.render()
    }
    state.resizeObs = new ResizeObserver(resize)
    state.resizeObs.observe(document.body)
    resize()
  },
  render(state) {
    const menuMobileEl = document.getElementById('menu-mobile')
    const menuDesktopEl = document.getElementById('menu-desktop')

    const menuClasses = [
      'flex-col',
      'fixed',
      'top-0',
      'bottom-0',
      '-left-full',
      'transition-all',
      'bg-dark-bg',
      'light:bg-rd-bg',
      'z-50',
      'px-4',
      'py-16',
      'max-w-lg',
      'border-r',
      'border-rd-sagwa',
    ]
    if (state.ismobile) {
      switchClasses(menuMobileEl, 'flex', 'hidden')
      menuDesktopEl.classList.add(...menuClasses)
      menuDesktopEl.classList.remove('justify-center')
    } else {
      switchClasses(menuMobileEl, 'hidden', 'flex')
      menuDesktopEl.classList.remove(...menuClasses)
      menuDesktopEl.classList.add('justify-center')
    }
  },
}
