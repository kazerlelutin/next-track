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

  // Convert code
  markdown = markdown.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
  markdown = markdown.replace(/`(.*?)`/g, '<code>$1</code>')

  // Convert blockquotes
  markdown = markdown.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')

  // Convert horizontal rules
  markdown = markdown.replace(/^\-{3,}$/gm, '<hr />')

  // Convert lists (unordered and ordered)
  markdown = convertLists(markdown)

  // Preserve line breaks within paragraphs (without affecting block elements)
  markdown = markdown
    .split(/\n+/)
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

// Helper function to convert lists with support for nested lists
function convertLists(markdown) {
  const lines = markdown.split('\n')
  let html = ''
  let listStack = []
  let currentIndent = 0

  const pushList = (isOrdered) => {
    const listTag = isOrdered ? 'ol' : 'ul'
    listStack.push(listTag)
    html += `<${listTag}>`
  }

  const popList = () => {
    const listTag = listStack.pop()
    html += `</${listTag}>`
  }

  lines.forEach((line) => {
    const unorderedMatch = /^(\s*)-\s+(.*)/.exec(line)
    // format 1. 2.
    const orderedMatch = /^(\s*)\d+\.\s+(.*)/.exec(line)

    if (unorderedMatch || orderedMatch) {
      const indentLevel = (unorderedMatch ? unorderedMatch[1] : orderedMatch[1])
        .length
      const isOrdered = !!orderedMatch
      const content = unorderedMatch ? unorderedMatch[2] : orderedMatch[2]

      if (indentLevel > currentIndent) {
        pushList(isOrdered)
      } else if (indentLevel < currentIndent) {
        while (currentIndent > indentLevel) {
          popList()
          currentIndent -= 2 // Adjust for indentation
        }
      }

      currentIndent = indentLevel
      html += `<li>${content}</li>`
    } else {
      // If we encounter a non-list line, close any open lists
      while (listStack.length > 0) {
        popList()
      }
      html += line.trim() ? `<p>${line.trim()}</p>` : ''
    }
  })

  // Close any remaining open lists
  while (listStack.length > 0) {
    popList()
  }

  return html
}
