import imports from '../../../_gen'

export async function onRequest(context) {
  const {
    params: { category },
  } = context
  const categories = imports.filter((s) => s.name.startsWith(`${category}_`))

  const result = [
    ...categories.map((cat) => {
      const [name, section] = cat.name.split('_')

      return {
        name,
        section,
        url: `${context.functionPath}/${section}`,
      }
    }),
  ]

  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
