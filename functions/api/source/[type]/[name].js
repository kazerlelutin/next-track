import { sources } from '../../../../data/sources'

export async function onRequest(context) {
  const sc = sources.find((source) => source.name === context.params.type)

  const files = await sc.files

  const media = files.find((file) => file.name === context.params.name)

  if (!media) return new Response('Not found', { status: 404 })

  return new Response(JSON.stringify(media), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
