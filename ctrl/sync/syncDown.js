const BASE_CHRONO = 300000
const syncPrefix = 'sync-'

export const syncDown = {
  state: {
    confirmCode: 0,
  },
  onInit(state, el) {
    //2 num
    state.confirmCode = Math.floor(Math.random() * 100)
    const app = document.querySelector('#app')

    const subHandler = (payload) => {}

    app.sub(syncPrefix + state.randomCode, subHandler)

    const form = el.querySelector('#form-sync')
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const id = form.querySelector('#code_input').value
      const confirCodeEl = el.querySelector('#confirm_code')
      state.confirmCode = Math.floor(Math.random() * 100)
      confirCodeEl.textContent = state.confirmCode
      app.trigger(syncPrefix + id, {
        confirmCodeM2: state.confirmCode,
      })
      const elToDisplay = el.querySelectorAll('[data-hide="true"]')
      const elToHide = el.querySelectorAll('[data-hide="false"]')
      elToHide.forEach((el) => {
        el.setAttribute('data-hide', 'true')
      })
      elToDisplay.forEach((el) => {
        el.setAttribute('data-hide', 'false')
      })
    })
  },
}
