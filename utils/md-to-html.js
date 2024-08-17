export function mdToHtml(markdown) {
  // Convert title tags
  markdown = markdown.replace(/^##### (.*$)/gim, '<h5>$1</h5>')
  markdown = markdown.replace(/^#### (.*$)/gim, '<h4>$1</h4>')
  markdown = markdown.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  markdown = markdown.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  markdown = markdown.replace(/^# (.*$)/gim, '<h1>$1</h1>')

  // Convert bold, italics, underline, and strikethrough
  markdown = markdown.replace(/\*\*([^*]+)\*\*/gim, '<b>$1</b>')
  markdown = markdown.replace(/\*([^*]+)\*/gim, '<i>$1</i>')
  markdown = markdown.replace(/__(.*?)__/gim, '<u>$1</u>')
  markdown = markdown.replace(/~~(.*?)~~/gim, '<s>$1</s>')

  // Convert links and images
  markdown = markdown.replace(
    /\[([^\]]+)\]\((http[^)]+)\)/gim,
    '<a href="$2">$1</a>'
  )
  markdown = markdown.replace(
    /\!\[([^\]]+)\]\(([^)]+)\)/gim,
    '<img src="$2" alt="$1" />'
  )

  // Convert lists (unordered and ordered)
  markdown = markdown.replace(/^\* (.*$)/gim, '<li>$1</li>')
  markdown = markdown.replace(/^\d+\.\s+(.*$)/gim, '<li>$1</li>')

  // Handle wrapping <li> elements inside <ul> or <ol>
  markdown = markdown.replace(/(<li>.*<\/li>)/gim, (m) => {
    const tag = /^\d+\.\s/.test(m) ? 'ol' : 'ul'
    return `<${tag}>${m}</${tag}>`
  })

  // Convert code
  markdown = markdown.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
  markdown = markdown.replace(/`(.*?)`/g, '<code>$1</code>')

  // Convert blockquotes
  markdown = markdown.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')

  // Convert horizontal rules
  markdown = markdown.replace(/^\-{3,}$/gm, '<hr />')

  // Preserve line breaks within paragraphs (without affecting block elements)
  markdown = markdown
    .split(/\n/)
    .map((line) => {
      // Handle empty lines as intentional line breaks
      if (line.trim().length === 0) return '<br />'

      // Skip adding <p> tags to block-level elements
      if (
        /^(<h\d|<ul|<ol|<pre|<blockquote|<hr|<img|<code|<li>)/.test(line.trim())
      ) {
        return line.trim()
      }

      // Otherwise, wrap in <p> tags
      return `<p>${line.trim()}</p>`
    })
    .join('\n')

  return markdown
}
