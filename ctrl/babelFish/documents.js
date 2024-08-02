import { translation } from '../../data/translation'
import { kll, translateLsKey } from '../../main'
import { Docs, openDatabase } from '../../utils/idb'

export const documents = {
  onInit(_, el) {
    el.render()
  },
  async render(_state, el) {
    const lang = localStorage.getItem(translateLsKey)
    await openDatabase()
    const docs = await Docs.get()
    el.innerHTML = docs
      .map((doc) => {
        const title = doc?.content?.blocks?.find(
          (block) => block.type === 'header'
        ) || {
          data: { text: translation.noTitle?.[lang] || translation.noTitle.en },
        }

        const div = document.createElement('div')
        div.innerHTML = title.data.text
        return `<a href="/babelfish-doc/${doc.id}" kll-ctrl="link" class="border border-rd-sagwa_young px-3 py-2 rounded text-rd-text">${div.innerText}</a>`
      })
      .join('')

    kll.reload(el)
  },
}
