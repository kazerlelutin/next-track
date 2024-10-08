import { kll, translateLsKey } from '../main'
import gen from '../_gen/'
import { getNotFound } from '../utils/getNotFound'

export const sections = {
  async onInit(_, el) {
    const { params } = kll.parseRoute()
    const source = gen.find(
      (s) => s.name === `${params.category}_${params.section}`
    )
    if (!source) {
      document.getElementById('return_button')?.remove()
      return await getNotFound(el)
    }

    const lang = localStorage.getItem(translateLsKey)

    const files = await source.file

    if (files.length === 0) return await getNotFound(el)
    for (const file of files
      .sort((a, b) => {
        if (a.ext === 'md' && b.ext === 'md') {
          const indexA = parseInt(a?.data?.index || '1000', 10)
          const indexB = parseInt(b?.data?.index || '1000', 10)

          if (indexA !== indexB) return indexA - indexB
          return a.name.localeCompare(b.name)
        }

        if (a.ext === 'md' && b.ext !== 'md') return -1
        if (a.ext !== 'md' && b.ext === 'md') return 1
        return 0
      })
      .filter((f) => {
        if (f.ext === 'md') {
          return f.lang === lang
        }
        return true
      })) {
      if (file.ext === 'svg') {
        const template = await kll.processTemplate('svgMini')

        kll.plugins.smartRender(template, {
          ...file,
          href: `/ressource/${params.category}/${params.section}/${file.name}`,
          name: file.title[lang] || file.name,
          img: file.url,
        })
        el.appendChild(template)
      }

      if (file.ext === 'md') {
        const template = await kll.processTemplate('mdMini')

        const description = {
          fr: 'document',
          en: 'document',
          kr: '문서',
        }

        kll.plugins.smartRender(template, {
          ...file,
          name: file?.data?.title || file.name,
          description: description[lang],
          href: `/ressource/${params.category}/${params.section}/${file.name}`,
        })

        el.appendChild(template)
      }

      if (file.ext === 'json') {
        const template = await kll.processTemplate('mdMini')
        kll.plugins.smartRender(template, {
          ...file,
          name: file.title[lang] || '',
          description: file.description[lang] || '',
          href: `/ressource/${params.category}/${params.section}/${file.name}`,
        })
        el.appendChild(template)
      }
    }
    kll.plugins.translate(el)
    kll.reload(el)
  },
}
