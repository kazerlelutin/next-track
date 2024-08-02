import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Table from 'editorjs-table'
import Quote from '@editorjs/quote'
import { Docs, openDatabase } from '../../utils/idb'
import { kll } from '../../main'
import { debounce } from '../../utils/debounce'

export const editor = {
  state: {
    editor: undefined,
    updatedAt: Date.now(),
    content: undefined,
    id: undefined,
  },

  async onInit(state) {
    await openDatabase()
    const { params } = kll.parseRoute()

    const docs = await Docs.get()

    if (docs.length === 0) return
    const doc = params.id
      ? docs.find((d) => d.id == params.id)
      : docs.sort((a, b) => b.updatedAt - a.updatedAt)[0]

    // update doc for home page
    await Docs.update(doc)

    state.id = doc.id
    const editor = new EditorJS({
      holder: 'editorContainer',
      autofocus: true,
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: 'Enter a header',
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 3,
          },
        },
        list: List,
        table: {
          class: Table,
        },
        quote: Quote,
      },
      data: doc.content,
      onReady: () => {
        state.editor = editor
        state.updatedAt = Date.now()
        state.content = doc.content
      },
      onChange: debounce(() => {
        editor.save().then((outputData) => {
          state.updatedAt = Date.now()
          state.content = outputData
          Docs.update({ ...doc, content: outputData })
        })
      }, 1000), // Délais de 1000ms pour le debounce
    })
  },
}
