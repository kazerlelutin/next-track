import imports from '../../../../../_gen'
import { mdToHtml } from '../../../../../utils/md-to-html'

export async function onRequest(context) {
  const {
    params: { category, section, name },
  } = context

  const fileNames = `${category}_${section}`
  const sec = imports.find((s) => s.name === fileNames)

  if (!sec) return new Response('Not found', { status: 404 })

  sec.file = await sec.file

  const find = sec.file.find((file) => file.name === name)
  if (!find) return new Response('Not found', { status: 404 })

  if (find.ext === 'svg') {
    const data = { ...find.data }
    if (data.description) {
      Object.keys(data.description).forEach((key) => {
        if (data.description[key] === null) return
        data.description[key] = {
          html: mdToHtml(data.description[key]),
          markdown: data.description[key],
        }
      })
    }
    return new Response(JSON.stringify({ ...find, data }), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  if (find.ext === 'json') {
    return new Response(JSON.stringify(find), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const media = {
    name,
    ext: find.ext,
    section,
    type: find.type,
    fileName: find.fileName,
    langs: {},
  }

  if (media.type === 'md') {
    const mds = sec.file.filter((s) => s.name === name)
    media.langs = {}
    for (const md of mds) {
      media.langs[md.lang] = {
        html: mdToHtml(md.content),
        markdown: md.content,
        meta: md.data,
      }
    }
  }

  return new Response(JSON.stringify(media), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
