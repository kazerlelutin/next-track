export function extractMetaFromMd(md) {
  const meta = {}
  const lines = md.split('\n')

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

  return {
    meta,
    content,
  }
}
