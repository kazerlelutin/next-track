const BASE_CHRONO = 300000
export const sync = {
  state: {
    randomCode: 0,
    confirmCode: 0,
    chrono: BASE_CHRONO,
  },
  onInit(state, el) {
    // 4 num
    state.randomCode = Math.floor(Math.random() * 10000)
    //2 num
    state.confirmCode = Math.floor(Math.random() * 100)

    const codeEl = el.querySelector('#code')
    codeEl.textContent = state.randomCode
    const app = document.querySelector('#app')

    const subHandler = (update) => {
      console.log('update ==>', update)
    }

    app.sub('/sync', subHandler)

    setInterval(() => {
      app.trigger('/sync', { randomCode: state.randomCode })
    }, 2000)

    app.sub('/sync' + state.randomCode, subHandler)

    const chronoEl = el.querySelector('#chrono')
    requestAnimationFrame(() => {
      let lastTime = Date.now()

      const update = () => {
        const now = Date.now()
        state.chrono -= now - lastTime
        lastTime = now

        if (state.chrono <= 0) {
          app._socket.unsubscribe('/sync/' + state.randomCode)
          state.randomCode = Math.floor(Math.random() * 10000)

          app._socket.subscribe('/sync/' + state.randomCode, subHandler)
          codeEl.textContent = state.randomCode

          state.chrono = BASE_CHRONO
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

    const form = el.querySelector('#form-sync')
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const id = form.querySelector('#code_input').value
      const confirCodeEl = el.querySelector('#confirm_code')
      confirCodeEl.textContent = state.confirmCode
      state.confirmCode = Math.floor(Math.random() * 100)
      await fetch(import.meta.env.VITE_BACK_URL + '/save', {
        method: 'POST',
        body: JSON.stringify({ id, confirmCode: state.confirmCode }),
      })
    })
  },
}
