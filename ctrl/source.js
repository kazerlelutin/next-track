import { sources } from '../data/sources'
import { kll, translateLsKey } from '../main'

export const source = {
  state: {},
  async onInit(_state, el) {
    const { params } = kll.parseRoute()

    const sc = sources.find((source) => source.name === params.type)

    const files = await sc.files

    const media = files.find((file) => file.name === params.name)

    if (!media) {
    } else {
      const lang = localStorage.getItem(translateLsKey)

      const mediaData = media.data || {}
      kll.plugins.smartRender(el, {
        img: media.url,
        creator: mediaData.creator || '',
        description:
          mediaData.description[lang] || mediaData.description.fr || '',
        name: mediaData.name || media.name,
      })

      if (!media.url) return

      const { data } = kll.plugins.manageAttrs(
        el.querySelector('[data-source-img]')
      )

      data.hide = 'false'
    }

    const loader = document.querySelector('[ data-source-loader]')
    if (loader) loader.remove()
  },
  render(_state, el) {},
}
