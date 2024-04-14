import imports from '../../../../_gen'
import { mdToHtml } from '../../../../utils/md-to-html'

export async function onRequest(context) {
  const {
    params: { category, section },
  } = context

  const fileNames = `${category}_${section}`
  const sec = imports.find((s) => s.name === fileNames)

  if (!sec) return new Response('Not found', { status: 404 })

  const files = await sec.file

  const noDoubleFiles = files.filter(
    (file, index, self) => index === self.findIndex((t) => t.name === file.name)
  )
  const result = {
    name: section,
    category,
    url: `${context.functionPath}`,
    files: noDoubleFiles.map((file) => {
      const newFile = { ...file }
      if (file.type === 'md') {
        const mds = files.filter((s) => s.name === file.name)
        newFile.langs = {}
        for (const md of mds) {
          if (!md.lang) continue
          newFile.langs[md.lang] = {
            html: mdToHtml(md.content || ''),
            markdown: md.content || '',
            meta: md.data,
          }
        }
      }

      return {
        name: file.name,
        section,
        category,
        ...newFile,
        url: `${context.functionPath}/${file.name}`,
      }
    }),
  }

  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
