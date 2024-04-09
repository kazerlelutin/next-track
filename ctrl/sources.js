import { sources as sourceData } from '../data/sources'
import { kll } from '../main'

export const sources = {
  state: {},
  async onInit(_state, el) {
    const { params } = kll.parseRoute()

    const type = params.type

    if (!type) return

    const src = sourceData.find((source) => source.name === type)
    const files = await src.files

    files.forEach((file) => {
      const item = document.createElement('a')
      item.innerHTML = `
        <a href="/source/${type}/${
        file.name
      }" kll-ctrl="link" class="relative flex flex-col items-center justify-center border border-rd-link rounded">
        
          <img src="${file.url}" class="w-40 h-auto" />
          <div class="text-sm font-bold dark:text-rd-pur text-rd-text z-1">${
            file?.data.name || file.name
          }</div>
        </a>
      `
      el.appendChild(item)
    })
  },
  render() {},
}
