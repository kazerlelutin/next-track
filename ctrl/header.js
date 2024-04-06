import { kll } from '../main'

export const header = {
  async onInit(_state, el) {
    el.render()

    const res = await fetch('/api/helloworld')
    console.log(await res.text())
  },
  render(_state, el) {
    kll.plugins.translate(el)
  },
}
