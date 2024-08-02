import { Docs, Words, openDatabase } from '../../utils/idb'
import { kll, translateLsKey } from '../../main'
import { translation } from '../../data/translation'

export const importDb = {
  async onChange(_, _el, e) {
    const file = e.target.files[0]
    if (!file) return
    const text = await file.text()
    const dataJson = JSON.parse(text)

    await openDatabase()
    const words = await Words.get()
    const docs = await Docs.get()

    // ====== WORDS ======
    const newWords = dataJson.words

    // === UPDATE WORDS ===
    const wordsToUpdate = words.filter((word) => {
      const newWord = newWords.find((w) => w.name === word.name)
      return newWord && newWord.state !== 'unknown'
    })

    for (const word of wordsToUpdate) {
      const newWord = newWords.find((w) => w.name === word.name)
      await Words.update({ ...word, ...newWord })
    }

    // === ADD WORDS ===
    const wordsToAdd = newWords.filter(
      (word) => !words.find((w) => w.name === word.name)
    )

    for (const word of wordsToAdd) {
      delete word.id
      await Words.add(word)
    }

    // ====== DOCS ======
    const newDocs = dataJson.docs

    // === UPDATE DOCS ===
    const docsToUpdate = docs.filter((doc) => {
      const newDoc = newDocs.find((d) => d.title === doc.title)
      return newDoc
    })

    for (const doc of docsToUpdate) {
      const newDoc = newDocs.find((d) => d.title === doc.title)
      await Docs.update({ ...doc, ...newDoc })
    }

    // === ADD DOCS ===
    const docsToAdd = newDocs.filter(
      (doc) => !docs.find((d) => d.title === doc.title)
    )

    for (const doc of docsToAdd) {
      delete doc.id
      await Docs.add(doc)
    }

    const lang = localStorage.getItem(translateLsKey)
    const container = document.getElementById('import-db-container')

    const template = await kll.processTemplate('importResult')
    kll.plugins.smartRender(template, {
      wordCreatedLabel:
        wordsToAdd.length > 1
          ? translation.addedWord_plural[lang]
          : translation.addedWord[lang],
      wordUpdatedLabel:
        wordsToUpdate.length > 1
          ? translation.updatedWord_plural[lang]
          : translation.updatedWord[lang],
      docCreatedLabel:
        docsToAdd.length > 1
          ? translation.addedDoc_plural[lang]
          : translation.addedDoc[lang],
      docUpdatedLabel:
        docsToUpdate.length > 1
          ? translation.updatedDoc_plural[lang]
          : translation.updatedDoc[lang],
      wordCreatedCount: wordsToAdd.length,
      wordUpdatedCount: wordsToUpdate.length,
      docCreatedCount: docsToAdd.length,
      docUpdatedCount: docsToUpdate.length,
    })
    container.innerHTML = template.outerHTML
  },
}
