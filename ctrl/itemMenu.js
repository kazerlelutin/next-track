import { menuSources } from '../data/menu-sources'
import { kll } from '../main'

export const itemMenu = {
  state: {},
  onInit(_state, el) {
    menuSources.forEach((source) => {
      const item = document.createElement('a')
      item.innerHTML = `
          <a href="/source/${
            source.name
          }" kll-ctrl="link" class="relative flex w-36 items-center justify-center h-20  rounded-sm overflow-hidden bg-lime-800 dark:bg-rd-urban_gray">
            ${
              source.cover
                ? `<div style="background: center/200% url(${source.cover})" class="absolute inset-0 z-0 "></div>`
                : ''
            }
            <div href="/source/${
              source.name
            }" class="text-sm uppercase absolute inset-0 flex items-center justify-center dark:bg-opacity-30 bg-opacity-40 dark:bg-black bg-white font-bold dark:text-rd-pur text-rd-text z-1">${
        source.name
      }</div>
          </a>
        `
      el.appendChild(item)
    })
    kll.reload(el)
  },
}
