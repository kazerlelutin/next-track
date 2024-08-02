import { demoDoc } from '../data/demo-doc'
import { translateLsKey } from '../main'
import { Docs, Words } from './idb'

export async function seed() {
  const lang = localStorage.getItem(translateLsKey) || 'en'

  const translate = {
    en: {
      hello: 'hello',
      language: 'language',
    },
    fr: {
      hello: 'bonjour',
      language: 'langue',
    },
    kr: {
      hello: '안녕하세요',
      language: '언어',
    },
  }

  const words = [
    {
      name: '안녕하세요',
      translation: translate[lang].hello,
    },
    {
      name: 'hello',
      translation: translate[lang].hello,
    },
    {
      name: 'bonjour',
      translation: translate[lang].hello,
    },
    {
      name: '언어',
      translation: translate[lang].language,
    },
    {
      name: 'language',
      translation: translate[lang].language,
    },
    {
      name: 'langue',
      translation: translate[lang].language,
    },
  ]

  for (const word of words) {
    const find = await Words.getById(word.name)

    if (find) continue
    await Words.add({
      name: word.name,
      state: 'familiar',
      translation: word.translation,
      relations: [],
      info: '',
      emoji: '',
      lang: '',
    })
  }

  const docs = await Docs.get()
  if (docs.length > 0) return true
  Docs.add({
    ...demoDoc,
    updatedAt: Date.now(),
  })
  return true
}
