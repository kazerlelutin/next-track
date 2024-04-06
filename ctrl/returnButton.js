import { kll } from '../main'
import { getByDataAttr } from '../utils/getByDataAttr'

export const returnButton = {
  onInit(_, el) {
    el.render()
  },
  render(_, el) {
    const textEl = getByDataAttr(el, 'text')
    const { route } = kll.parseRoute()

    const routeLength = route.split('/').length

    if (route.match(/offskate|warmup/) && routeLength <= 2) {
      el.href = '/'
      textEl.setAttribute('data-trans', 'home')
      kll.plugins.translate(textEl)
    }
  },
}
