import { kll } from '../main'
import gen from '../_gen/'
import { INTERNAL_APPS } from '../utils/constants'
import { link } from './link'

export const ctxMenu = {
  async onInit(_, el) {
    const { template, route: _route } = kll.parseRoute()
    el.innerHTML = ''

    const cats = [
      ...INTERNAL_APPS,
      ...gen.filter((s) => s.name.includes('menu-')),
    ]

    const appMenu = document.getElementById('app-menu')
    appMenu.innerHTML = ''

    for (const cat of cats) {
      const name = cat.name.split('menu-')[1] || cat.name
      const linkEl = document.createElement('a')
      linkEl.href = cat.external ? '/' + cat.path : `/category/${name}`
      linkEl.setAttribute('data-trans', name)
      linkEl.setAttribute('kll-id', name)
      linkEl.addEventListener('click', async (e) => link.onClick(_, linkEl, e))
      kll.plugins.translate(linkEl)
      appMenu.appendChild(linkEl)
    }

    if (template.includes('babelfish')) {
      const template = await kll.processTemplate('headerMenuBabelFish')
      el.appendChild(template)
    }

    const elLinks = el.querySelectorAll('a')
    elLinks.forEach((l) => {
      l.addEventListener('click', async (e) => link.onClick(_, l, e))
    })
    const panelMenuEl = document.getElementById('panel-menu')
    const route = _route.split('/')[1]

    if (!route || route.match(/category/)) {
      const mainEl = document.getElementById('main-content')
      if (mainEl) {
        mainEl.classList.remove('main-content')
      }
    }

    if (panelMenuEl) {
      const links = panelMenuEl.querySelectorAll('a')
      links.forEach((link) => {
        const cleanUri = link.href.split('//')[1]
        const linkRoute = '/' + cleanUri.split('/').slice(1).join('/')

        if (
          (!linkRoute && !route) ||
          linkRoute === _route ||
          linkRoute === route ||
          (linkRoute === 'babelfish-docs' && route === 'babelfish-doc')
        ) {
          if (link.getAttribute('data-external')) return
          link.setAttribute('aria-current', 'page')
        } else {
          link.removeAttribute('aria-current')
        }
      })
    }
  },
}
