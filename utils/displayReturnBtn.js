import { kll } from '../main'

export function displayReturnBtn() {
  const returnButtonEl = document.querySelector('#return_button')
  if (!returnButtonEl) return
  const { route } = kll.parseRoute()

  if (route.match(/category|ressource/))
    returnButtonEl.classList.remove('hidden')
  else returnButtonEl.classList.add('hidden')
}
