import { translation } from '../../data/translation'
import { kll, translateLsKey } from '../../main'
import { Words, openDatabase } from '../../utils/idb'

export const transTest = {
  state: {
    transIsHidden: true,
    word: '',
  },
  onInit(_, el) {
    el.render()
  },
  async render(state, el) {
    await openDatabase()
    const word = await Words.getById(state.word)
    if (!word) return

    if (!word?.translation) {
      const input = document.querySelector('input[data-hidden]')

      input.removeAttribute('data-hidden')
      el.remove()
    } else {
      kll.plugins.translate(el)
      const lang = localStorage.getItem(translateLsKey)

      const words = await Words.get()
      const translatedWords = words
        .filter(
          (w) => w.translation && w.lang === word.lang && w.id !== word.id
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
      const answers = [
        {
          good: true,
          name: word.translation,
        },
        ...translatedWords.map((w) => ({
          good: false,
          name: w.translation,
        })),
      ].sort(() => Math.random() - 0.5)

      if (answers.length < 4) {
        while (answers.length < 4) {
          answers.push({
            good: false,
            name: translation.noData[lang] || translation.noData.en,
          })
        }
      }

      const container = el.querySelector('[data-choice]')

      for (const answer of answers) {
        const button = await kll.processTemplate('answerTest')
        button.innerHTML = answer.name
        button.setAttribute('data-good', answer.good)
        kll.plugins.smartRender(button, answer)

        const handleClick = () => {
          if (answer.good) {
            const input = document.querySelector('input[data-hidden]')
            input.removeAttribute('data-hidden')
            el.remove()
          } else {
            button.classList.add('opacity-0')
            button.removeEventListener('click', handleClick)
          }
        }

        button.addEventListener('click', handleClick)
        container.appendChild(button)
      }
    }
  },
}
