import gen from '../_gen/'
import { kll } from '../main'

export const categories = {
  async onInit(_, el) {
    const container = document.createElement('div')
    for (const cat of gen.filter((s) => s.name.includes('menu-'))) {
      const catEl = await kll.processTemplate('category')

      kll.plugins.smartRender(catEl, {
        title: cat.name.split('menu-')[1],
      })

      const files = await cat.file

      const sections = document.createElement('div')
      for (const file of files) {
        const miniature = await kll.processTemplate('miniature')
        const container = document.createElement('div')
        container.appendChild(miniature)
        kll.plugins.smartRender(container, {
          name: file.name,
          cover: file.cover,
          href: `/category/${cat.name.split('menu-')[1]}/${file.name}`,
        })

        sections.appendChild(container.firstChild)
      }

      kll.plugins.smartRender(catEl, {
        title: cat.name.split('menu-')[1],
        sections: sections.innerHTML,
      })

      container.appendChild(catEl)
      kll.plugins.translate(catEl)
      el.insertAdjacentHTML('afterend', catEl.innerHTML)
    }

    el.remove()
    kll.reload(document.body) // because innerHTML
  },
}
