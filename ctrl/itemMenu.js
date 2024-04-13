import { kll } from '../main'

export const itemMenu = {
  state: {},
  async onInit(_state, el) {
    return
    for (const source of menuSources) {
      const miniature = await kll.processTemplate('miniature')
      if (!source.cover) miniature.querySelector('[data-cover]').remove()
      kll.plugins.smartRender(miniature, {
        ...source,
        href: `/section/${source.name}`,
      })
      el.appendChild(miniature)
    }
    kll.plugins.translate(el)
    kll.reload(el)
  },
}
