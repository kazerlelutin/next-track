export function mdToHtml(markdown) {
  // Convertir les balises de titre
  markdown = markdown.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  markdown = markdown.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  markdown = markdown.replace(/^# (.*$)/gim, '<h1>$1</h1>')

  // Convertir les gras et italiques
  markdown = markdown.replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
  markdown = markdown.replace(/\*(.*)\*/gim, '<i>$1</i>')

  // Convertir les liens
  // S'assure que le texte ne commence pas par un "!", ce qui indiquerait une image
  markdown = markdown.replace(
    /\[([^\]]+)\]\((http[^)]+)\)/gim,
    (match, p1, p2) => {
      if (match.startsWith('!')) {
        return match // Si c'est une image, ne pas la convertir ici
      }
      return `<a href="${p2}">${p1}</a>` // Convertir en lien HTML
    }
  )

  // Convertir les images
  // Utilise un préfixe "!" pour identifier les images
  markdown = markdown.replace(
    /\!\[([^\]]+)\]\(([^)]+)\)/gim,
    '<img src="$2" alt="$1" />'
  )

  // Convertir les paragraphes
  markdown = markdown
    .split(/\n\n/)
    .map((paragraph) => `<p>${paragraph.trim()}</p>`)
    .join('\n')

  // Convertir les paragraphes
  markdown = markdown
    .split(/\n\n/)
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join('\n')

  // Convertir les sauts de ligne
  markdown = markdown.replace(/\n/gim, '<br />')

  return markdown
}
