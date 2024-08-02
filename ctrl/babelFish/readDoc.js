import { translation } from '../../data/translation'
import { defaultLangWordKey, kll, translateLsKey } from '../../main'
import { Words, openDatabase } from '../../utils/idb'
import { WORD_STATES } from '../../utils/word-states'

function encapsuleWord(text) {
  const container = document.createElement('div')
  container.innerHTML = text

  const wordsSan = container.innerText.split(' ')

  return wordsSan
    .map((word) => {
      const firstChar = word.charAt(0)
      const lastChar = word.charAt(word.length - 1)
      const specialCharsReg = /[`~!@#$%^&*()_|+\-=?;:,.<>/]/g
      let text = ''
      if (specialCharsReg.test(firstChar)) {
        text += firstChar
        word = word.slice(1)
      }
      if (specialCharsReg.test(lastChar)) {
        word = word.slice(0, -1)
        text += `<span data-word="${word}">${word}</span>${lastChar}`
      } else {
        text += `<span data-word="${word}">${word}</span>`
      }

      return text
    })
    .join(' ')
}

function convertBlocksToHTML(blocks) {
  return blocks
    .map((block) => {
      let content = ''
      switch (block.type) {
        case 'header':
          content = `<h${block.data.level}>${encapsuleWord(
            block.data.text
          )}</h${block.data.level}>`
          break
        case 'paragraph':
          content = `<p>${encapsuleWord(block.data.text)}</p>`
          break
        case 'list':
          const listTag = block.data.style === 'ordered' ? 'ol' : 'ul'
          content = `<${listTag}>${block.data.items
            .map((item) => `<li>${encapsuleWord(item)}</li>`)
            .join('')}</${listTag}>`
          break
        case 'table':
          content = `<table>${block.data.content
            .map(
              (row) =>
                `<tr>${row
                  .map((cell) => `<td>${encapsuleWord(cell)}</td>`)
                  .join('')}</tr>`
            )
            .join('')}</table>`
          break
        case 'quote':
          content = `<blockquote>${encapsuleWord(block.data.text)}</blockquote>`
          break
        default:
          break
      }
      return content
    })
    .join('')
}

export const readDoc = {
  async render(_, _el) {
    const editorContainer = document.querySelector('[kll-id="editor"]')
    const container = document.querySelector('[kll-id="docContainer"]')
    const doc = editorContainer?.state?.content

    if (!doc || !container) return

    const blocks = doc?.blocks || []
    const lang = localStorage.getItem(translateLsKey)
    const actionTemplate = await kll.processTemplate('wordAction')

    const htmlContent = convertBlocksToHTML(blocks)

    container.innerHTML = htmlContent

    const spans = container.querySelectorAll('span[data-word]')

    await openDatabase()
    for (const span of spans) {
      if (!span.dataset.word) continue
      const word = await Words.findOrCreate(span.dataset.word, lang)

      span.setAttribute('data-word-state', word.state)

      span.addEventListener('click', async () => {
        // === SELECTION ================================
        const allSelectedWords = document.querySelectorAll('.selected-word')
        allSelectedWords.forEach((word) => {
          word.classList.remove('text-rd-highlight', 'selected-word')
        })
        span.classList.add('selected-word')

        // === MATCH WORD ================================

        const word = await Words.findOrCreate(span.dataset.word, lang)

        const container = document.getElementById('wordPreview')
        container.innerHTML = ''

        // === RENDER WORD ================================
        const template = await kll.processTemplate('wordPreview')
        kll.initsIds = [
          ...kll.initsIds.filter((id) => !id.match(/wordPreview/)),
        ]

        kll.plugins.smartRender(template, {
          ...word,
          lang: word.lang || localStorage.getItem(defaultLangWordKey),
          word: word.name,
          translation: word.translation || '',
          placeholder:
            translation.translationPlaceholder?.[lang] || 'placeholder',
          info: word?.info || translation.noInfo?.[lang] || 'no info',
        })

        container.appendChild(template)
        const actionsContainer = container.querySelector('#wordActions')

        for (const state of WORD_STATES) {
          const action = actionTemplate.cloneNode(true)
          action.innerText = translation[state][lang]

          action.setAttribute('data-state', state)
          action.setAttribute('data-word', word.name)

          action.addEventListener('click', async () => {
            await Words.update({
              ...word,
              state,
            })

            const actions = document.querySelectorAll('[data-action]')
            actions.forEach((act) => act.removeAttribute('disabled'))
            action.setAttribute('disabled', true)

            const doc = document.querySelector('[kll-id="editor"]')
            doc.state.updateAt = Date.now()
          })

          if (word.state === state) action.setAttribute('disabled', true)
          actionsContainer.appendChild(action)
        }

        const input = container.querySelector('#wordTranslation')

        input?.addEventListener('input', async () => {
          word.translation = input.value

          await Words.update(word)
        })

        kll.plugins.translate(container)
        kll.reload(container)
      })
    }
  },
}
