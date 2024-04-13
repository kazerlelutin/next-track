import imports from '../../_gen'

export async function onRequest(context) {
  const categories = imports.filter((s) => s.name.includes('menu-'))

  const result = [
    ...categories.map((cat) => ({
      name: cat.name.split('menu-')[1],
      files: [],
    })),
  ]

  for (const cat of categories) {
    const files = await cat.file
    const catName = cat.name.split('menu-')[1]

    if (!files) continue
    const resultCat = result.find((r) => r.name === catName)
    resultCat.files = files.map((file) => ({
      name: file.name,
      category: catName,
      cover: `${context.functionPath}/${catName}/${file.name}`,
    }))
  }

  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
