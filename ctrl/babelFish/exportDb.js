import { kll } from '../../main'
import { agentInfos } from '../../utils/agent-infos'
import { Docs, Words, openDatabase } from '../../utils/idb'

export const exportDb = {
  onInit(_, el) {
    kll.plugins.translate(el)
  },
  async onClick() {
    await openDatabase()

    const words = await Words.get()
    const docs = await Docs.get()

    const data = {
      words,
      docs,
    }

    const utf8Bytes = new TextEncoder().encode(JSON.stringify(data))
    const binaryString = Array.from(utf8Bytes)
      .map((byte) => String.fromCharCode(byte))
      .join('')
    const encodedText = btoa(binaryString)
    const date = new Date().toISOString().split('T')[0]
    const {
      device: { type },
    } = agentInfos()

    const a = document.createElement('a')
    a.href = `data:text/plain;base64,${encodedText}`
    a.download = `${type}-${date}.bfish`
    a.click()
    a.remove()
  },
}
