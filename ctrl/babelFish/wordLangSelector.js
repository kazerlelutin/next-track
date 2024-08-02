import { defaultLangWordKey } from '../../main'
import { Words } from '../../utils/idb'

export const wordLangSelector = {
  state: { word: '' },
  async onChange(state) {
    const lang = localStorage.getItem(defaultLangWordKey)

    const word = await Words.getById(state.word)
    if (!word) return

    await Words.update({
      ...word,
      lang,
    })
  },
}
