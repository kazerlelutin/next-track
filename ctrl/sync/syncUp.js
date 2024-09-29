import { SYNC } from '../../utils/constants'

export const syncUp = {
  state: {
    randomCode: 0,
    chrono: SYNC.BASE_CHRONO,
    runChrono: true,
  },
  onInit(state, el) {
    state.randomCode = Math.floor(Math.random() * 10000)

    const codeEl = el.querySelector('#code')

    codeEl.textContent = state.randomCode
    const app = document.querySelector('#app')

    const subHandler = (payload) => {
      if (payload.codes) {
        state.runChrono = false
        const choicesEl = el.querySelector('#choices')
        const elToDisplay = el.querySelectorAll('[data-hide="true"]')
        const elToHide = el.querySelectorAll('[data-hide="false"]')

        elToHide.forEach((el) => {
          el.setAttribute('data-hide', 'true')
        })
        elToDisplay.forEach((el) => {
          el.setAttribute('data-hide', 'false')
        })
        choicesEl.setAttribute('data-hide', 'false')

        payload.codes.forEach((code, index) => {
          const codeEl = choicesEl.querySelector(`#code-${index}`)
          console.log(codeEl)
          codeEl.textContent = code
        })
        return
      }
    }

    app.sub(SYNC.PREFIX + state.randomCode, subHandler)

    const chronoEl = el.querySelector('#chrono')
    requestAnimationFrame(() => {
      let lastTime = Date.now()

      const update = () => {
        if (!state.runChrono) return
        const now = Date.now()
        state.chrono -= now - lastTime
        lastTime = now

        if (state.chrono <= 0) {
          app.unSub(SYNC.PREFIX + state.randomCode)
          state.randomCode = Math.floor(Math.random() * 10000)
          app.sub(SYNC.PREFIX + state.randomCode, subHandler)
          codeEl.textContent = state.randomCode

          state.chrono = SYNC.BASE_CHRONO
        }

        // Convertir le temps restant en minutes et secondes
        const minutes = Math.floor(state.chrono / 60000)
        const seconds = Math.floor((state.chrono % 60000) / 1000)

        // Ajouter un zéro devant les secondes si elles sont inférieures à 10
        const formattedSeconds = seconds < 10 ? '0' + seconds : seconds

        // Afficher le temps restant
        chronoEl.textContent = `${minutes}:${formattedSeconds}`
        requestAnimationFrame(update)
      }

      update()
    })
  },
}
