export function onRequest(ctx) {
  const upgradeHeader = ctx.request.headers.get('Upgrade')

  if (!upgradeHeader || upgradeHeader !== 'websocket') {
    return new Response('Expected Upgrade: websocket', { status: 426 })
  }

  const webSocketPair = new WebSocketPair()
  const [client, server] = Object.values(webSocketPair)

  server.accept()
  server.addEventListener('message', async (event) => {
    console.log('Received from client:', await ctx.env.next_track.list())
    await ctx.env.next_track.put('ws', 'Hello from the server KV')

    server.send(
      JSON.stringify({
        channel: '/sync',
        msg: await ctx.env.next_track.get('ws'),
      })
    )
  })

  return new Response(null, {
    status: 101,
    webSocket: client,
  })
}
