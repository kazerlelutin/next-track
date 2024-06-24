export function extractMetaFromMd(md) {
  const meta = {}
  const lines = md.split('\n')

  console.log(lines)

  let i = 0
  for (i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith('---')) {
      break
    }

    const [key, value] = line.split(':')
    if (key && value) {
      meta[key.trim()] = value.trim()
    }
  }

  const content = lines.slice(i + 1).join('\n')

  console.log(content)

  return {
    meta,
    content,
  }
}
