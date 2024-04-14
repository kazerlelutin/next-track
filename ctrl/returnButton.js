import { kll } from '../main'
import { getByDataAttr } from '../utils/getByDataAttr'

export const returnButton = {
  onInit(_, el) {
    el.render()
  },
  render(_, el) {
    const textEl = getByDataAttr(el, 'text')
    const { route, params } = kll.parseRoute()

    if (route.match(/category/)) {
      if (params.section) {
        el.href = `/`
        textEl.setAttribute('data-trans', 'home')
      }
    }

    if (route.match(/ressource/)) {
      el.href = `/category/${params.category}/${params.section}`
      textEl.setAttribute('data-trans', params.section)
    }

    const arrow = el.querySelector('[data-arrow]')
    textEl.setAttribute('href', el.href)
    arrow.setAttribute('href', el.href)

    kll.plugins.translate(textEl)
  },
}
