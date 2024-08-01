import { kll } from '../main'

export const updateInfo = {
  async onInit(_, el) {
    try {
      const pkg = await import('../package.json')
      const updatedAt = await import('../_gen/updatedAt.json')
      const version = pkg.version
      const date = updatedAt.updatedAt
      el.querySelector('[data-version]').innerText = version
      el.querySelector('[data-update]').innerText = date
      kll.plugins.translate(el)
    } catch (error) {
      console.error('Error while updating info:', error)
    }
  },
}
