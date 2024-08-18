import { kll } from '../main'

export const ctxMenu = {
  async onInit(_, el) {
    const { template, route: _route } = kll.parseRoute()
    el.innerHTML = ''

    if (template.includes('babelfish')) {
      const template = await kll.processTemplate('headerMenuBabelFish')
      el.appendChild(template)
    }

    const panelMenuEl = document.getElementById('panel-menu')
    const route = _route.split('/')[1]

    if (panelMenuEl) {
      const links = panelMenuEl.querySelectorAll('a')
      links.forEach((link) => {
        const cleanUri = link.href.split('//')[1]
        const linkRoute = cleanUri.split('/')[1]
        console.log('linkRoute', linkRoute, 'route', route)
        if (
          (!linkRoute && !route) ||
          linkRoute === route ||
          (linkRoute === 'babelfish-docs' && route === 'babelfish-doc')
        ) {
          link.setAttribute('aria-current', 'page')
        } else {
          link.removeAttribute('aria-current')
        }
      })
    }
    kll.reload(el)
  },
}
