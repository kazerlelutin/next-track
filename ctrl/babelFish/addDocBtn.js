import { translation } from '../../data/translation'
import { kll, translateLsKey } from '../../main'
import { Docs, openDatabase } from '../../utils/idb'

export const addDocBtn = {
  onInit(_, el) {
    kll.plugins.translate(el)
  },
  async onClick() {
    const lang = localStorage.getItem(translateLsKey)
    await openDatabase()
    const doc = await Docs.add({
      content: {
        blocks: [
          {
            type: 'header',
            data: {
              text: translation.newDoc?.[lang] || translation.noTitle?.en,
              level: 2,
            },
          },
        ],
      },
    })
    const path = '/doc/' + doc
    window.history.pushState({}, '', path)
    kll.injectPage(path)
  },
}
