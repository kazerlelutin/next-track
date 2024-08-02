import { kll } from '../../main'

export const wordPreviewClose = {
  onInit(_, el) {
    kll.plugins.translate(el)
  },
  async onclick() {
    const allSelectedWords = document.querySelectorAll('.selected-word')
    allSelectedWords.forEach((word) => {
      word.classList.remove('text-rd-highlight', 'selected-word')
    })
    const container = document.getElementById('wordPreview')
    container.innerHTML = ''
  },
}
