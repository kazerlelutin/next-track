import { kll } from '../main'
import { getByDataAttr } from '../utils/getByDataAttr'

export const returnButton = {
  onInit(_, el) {
    el.render()
  },
  render(_, el) {
    const textEl = getByDataAttr(el, 'text')
    const { route, params } = kll.parseRoute()

    const routeLength = route.split('/').length

    if (route.match(/source/)) {
      if (routeLength === 4) {
        el.href = `/source/${params.type}`
        textEl.setAttribute('data-trans', params.type)
      } else if (routeLength === 3) {
        el.href = '/source'
        textEl.setAttribute('data-trans', 'source')
      } else {
        el.href = '/source'
        textEl.setAttribute('data-trans', 'source')
      }

      const arrow = el.querySelector('[data-arrow]')
      textEl.setAttribute('href', el.href)
      arrow.setAttribute('href', el.href)

      kll.plugins.translate(textEl)
    }
  },
}
