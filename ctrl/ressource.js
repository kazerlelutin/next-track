import { kll, translateLsKey } from '../main'
import gen from '../_gen/'
import { mdToHtml } from '../utils/md-to-html'
import { extractMetaFromMd } from '../utils/extractMetaFromMd'
import { getNotFound } from '../utils/getNotFound'

export const ressource = {
  async onInit(_, el) {
    const { params } = kll.parseRoute()
    const source = gen.find(
      (s) => s.name === `${params.category}_${params.section}`
    )

    if (!source) return await getNotFound(el)
    const lang = localStorage.getItem(translateLsKey)
    const files = await source.file
    const media = files.find((file) => file.name === params.name)

    if (!media) return await getNotFound(el)

    if (media.ext === 'json') {
      const template = await kll.processTemplate('mdRender')

      const content = async () => {
        if (!media.external) return description[lang]
        const res = await fetch(
          'https://metaseur.vercel.app/api?url=' + media.external
        )

        const mediaRaw = await res.json()

        const tmplt = await kll.processTemplate('metaPreview')

        kll.plugins.smartRender(tmplt, {
          ...media,
          ...mediaRaw,
          description:
            mediaRaw.description ||
            media.description[lang] ||
            media.description.fr,
          title: media.title[lang] || media.title.fr,
        })

        return tmplt.innerHTML
      }

      kll.plugins.smartRender(template, {
        ...media,
        title: media.title[lang] || media.title.fr,
        content: await content(),
        url: media.external,
      })
      el.appendChild(template)
    }

    if (media.type === 'md') {
      const mds = files
        .filter((file) => file.name === params.name)
        .sort((a, b) => {
          if (a.lang === lang && b.lang !== lang) return -1
          if (b.lang === lang && a.lang !== lang) return 1
          if (a.lang === 'en' && b.lang !== 'en') return -1
          if (b.lang === 'en' && a.lang !== 'en') return 1
          return 0
        })
      let md = mds.find((md) => md.lang === lang)
      if (!md) md = mds[0]

      const res = await fetch(md.url)
      const mediaRaw = await res.text()
      const template = await kll.processTemplate('mdRender')
      const { meta, content } = extractMetaFromMd(mediaRaw)

      kll.plugins.smartRender(template, {
        content: mdToHtml(content),
        author: meta?.author || '---',
        url: media.url,
        title: md?.data?.title || md.name,
      })

      el.appendChild(template)
    }

    if (media.type === 'svg') {
      const template = await kll.processTemplate('svgRender')
      const mediaData = media?.data || {}

      kll.plugins.smartRender(template, {
        img: media.url,
        creator: mediaData.creator || '',
        description: mdToHtml(
          mediaData.description[lang] || mediaData.description.fr || ''
        ),
        name: mediaData.name || media.name,
      })

      const { data } = kll.plugins.manageAttrs(
        template.querySelector('[data-source-img]')
      )
      data.hide = 'false'

      el.appendChild(template)
    }
    const loader = document.querySelector('[ data-source-loader]')

    if (loader) loader.remove()
    kll.plugins.translate(el)
    kll.reload(el)
  },
}
