import { kll } from '../../main'
import { Docs, openDatabase } from '../../utils/idb'

export const delDocBtn = {
  state: {
    id: null,
    confirm: false,
    callback: null,
    text: 'confirmDelDoc',
    subText: '',
  },
  async onInit(state) {
    const { params } = kll.parseRoute()

    const redirect = () => {
      const path = '/docs'
      window.history.pushState({}, '', path)
      kll.injectPage(path)
    }

    if (params.id) {
      await openDatabase()
      const doc = await Docs.getById(parseInt(params.id))

      state.callback = async () => {
        await openDatabase()
        await Docs.remove(doc.id)
        redirect()
      }
    } else {
      const editorEl = document.querySelector('[kll-id="editor"]')
      const id = state.id || editorEl?.state.id
      state.callback = async () => {
        await openDatabase()
        await Docs.remove(id)
        redirect()
      }
    }
  },
}
