import imports from '../../../../_gen'

export async function onRequest(context) {
  const {
    params: { category, section },
  } = context

  const fileNames = `${category}_${section}`
  const sec = imports.find((s) => s.name === fileNames)

  if (!sec) return new Response('Not found', { status: 404 })

  const files = await sec.file
  const result = {
    name: section,
    category,
    url: `${context.functionPath}`,
    files: files.map((file) => ({
      name: file.name,
      section,
      category,
      ...file,
      url: `${context.functionPath}/${file.name}`,
    })),
  }

  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
