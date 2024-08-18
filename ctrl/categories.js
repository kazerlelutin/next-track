import gen from '../_gen/'
import { kll } from '../main'

const INTERNAL_APPS = [
  {
    name: 'Babel Fish',
    path: 'babelfish',
    cover: 'sources/misc/babel_fish.svg',
  },
]

export const categories = {
  async onInit(_, el) {
    const container = document.createElement('div')
    for (const cat of [
      {
        name: 'tools',
        file: INTERNAL_APPS,
      },
      ...gen.filter((s) => s.name.includes('menu-')),
    ]) {
      const catName = cat.name.split('menu-')[1] || cat.name
      const catEl = await kll.processTemplate('category')

      kll.plugins.smartRender(catEl, {
        title: catName,
      })

      const files = await cat.file

      console.log(files)

      const sections = document.createElement('div')
      for (const file of files) {
        const miniature = await kll.processTemplate('miniature')
        const container = document.createElement('div')
        const href = cat.name.includes('menu-')
          ? `/category/${catName}/${file.name}`
          : `/${file.path}`
        container.appendChild(miniature)
        kll.plugins.smartRender(container, {
          name: file.name,
          cover: file.cover,
          href,
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
