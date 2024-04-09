import { kll } from '../main'

export const header = {
  state: {
    img: '',
  },
  async onInit(state, el) {
    el.render()

    /*
    const res = await fetch('/api/characters/sagwa')

    const media = await res.json()

    state.img = media.url
    kll.plugins.smartRender(el, {
      img: media.url,
    })

    //       <img src="{{img}}" />
    el.render()

    */
  },
  render(state, el) {
    kll.plugins.translate(el)

    /*
    kll.plugins.smartRender(el, {
      title: 'Hello World',
    })
    const { data } = kll.plugins.manageAttrs(el)

    data.test = 'rien'

    */
  },
}
