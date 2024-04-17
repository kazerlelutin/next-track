import { mdToHtml as md } from '../utils/md-to-html'

export const mdToHtml = {
  onInit(_, el) {
    el.render()
  },
  render() {
    const texts = document.querySelectorAll('[kll-md]')
    texts.forEach((text) => {
      text.innerHTML = md(text.innerText)
      text.removeAttribute('data-trans')
    })
  },
}
