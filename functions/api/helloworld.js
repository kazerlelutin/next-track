export function onRequest(context) {
  // Créez l'objet JSON que vous souhaitez renvoyer

  // Convertissez l'objet JSON en chaîne
  const jsonString = JSON.stringify({ salut: 'ok' })

  // Renvoyez la chaîne JSON avec l'en-tête 'Content-Type' défini sur 'application/json'
  return new Response(jsonString, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
