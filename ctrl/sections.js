import { kll } from '../main'
import gen from '../_gen/'

export const sections = {
  async onInit(_, el) {
    const { params } = kll.parseRoute()
    const source = gen.find(
      (s) => s.name === `${params.category}_${params.section}`
    )
    if (!source) return // TODO 404

    const files = await source.file
    for (const file of files) {
      if (file.ext === 'svg') {
        const template = await kll.processTemplate('svgMini')
        kll.plugins.smartRender(template, {
          ...file,
          href: `/ressource/${params.category}/${params.section}/${file.name}`,
          img: file.url,
        })
        el.appendChild(template)
      }

      console.log(file)
      if (file.ext === 'md') {
        const template = await kll.processTemplate('mdMini')
        kll.plugins.smartRender(template, {
          ...file,
          href: `/ressource/${params.category}/${params.section}/${file.name}`,
        })
        el.appendChild(template)
      }
    }
    kll.plugins.translate(el)
    kll.reload(el)
  },
}
