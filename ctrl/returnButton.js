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

    console.log(routeLength)
    if (route.match(/source/)) {
      if (routeLength === 4) {
        console.log('source')
        el.href = `/source/${params.type}`
        textEl.setAttribute('data-trans', params.type)
      } else if (routeLength === 3) {
        el.href = '/source'
        textEl.setAttribute('data-trans', 'source')
      } else {
        el.href = '/source'
        textEl.setAttribute('data-trans', 'source')
      }

      kll.plugins.translate(textEl)
    }
  },
}
