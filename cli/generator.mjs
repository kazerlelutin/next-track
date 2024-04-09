import { readdirSync, readFileSync, writeFileSync } from 'fs' // Utiliser fs/promises pour les opérations asynchrones
import path from 'path'
import { JSDOM } from 'jsdom'

function parseLanguageSections(text) {
  const sections = {}
  const regex = /\[(\w{2})\]\n([\s\S]*?)(?=\n\[\w{2}\]\n|$)/g

  let match
  while ((match = regex.exec(text)) !== null) {
    const langCode = match[1]
    const langText = match[2].trim()
    sections[langCode] = langText
  }

  return sections
}

async function extractDataFromSvg(svg) {
  const svgContent = readFileSync(svg, 'utf8')

  const dom = new JSDOM(svgContent)

  const document = dom.window.document

  const title = document.querySelector('dc\\:title')
  const creator = document.querySelector('dc\\:creator')
  const languages = document.querySelector('dc\\:language')
  const description = document.querySelector('dc\\:description')
  const subjects = document.querySelector('dc\\:subject')

  return {
    title: title.textContent,
    creator: creator.textContent,
    languages: languages.textContent,
    description: parseLanguageSections(description.textContent),
    subjects: subjects.innerHTML,
  }
}

async function generate() {
  const directoryPath = path.join(process.cwd(), '/public/sources')

  try {
    const files = readdirSync(directoryPath, { withFileTypes: true })

    const sources = []

    for (const file of files) {
      if (file.isDirectory()) {
        const folderPath = path.join(directoryPath, file.name)
        const filesRec = readdirSync(file.path + '/' + file.name, {
          withFileTypes: true,
        })

        const files = []

        for (const fileRec of filesRec) {
          if (fileRec.isFile()) {
            const filePath = folderPath + '/' + fileRec.name
            const content = readFileSync(filePath, 'utf8')
            if (content.match(/<svg/)) {
              const name = fileRec.name.replace('.svg', '')

              files.push({
                name,
                fileName: name,
                type: 'svg',
                ext: 'svg',
                data: await extractDataFromSvg(filePath),
                url: `/sources/${file.name}/${fileRec.name}`,
              })
            }
          }
        }
        const typeSourcePath = path.join(process.cwd(), `/data/${file.name}.js`)

        writeFileSync(
          typeSourcePath,
          `const ${file.name} = ${JSON.stringify(files)}\nexport default ${
            file.name
          }`,
          'utf8'
        )

        sources.push({
          name: file.name,
          files: `import('./${file.name}.js').then((m) => m.default)`,
          cover:
            files.length > 0
              ? `"/sources/${file.name}/${files[0].name}.${files[0].ext}"`
              : 'null',
        })
      }
    }

    writeFileSync(
      path.join(process.cwd(), '/data/sources.js'),
      `export const sources = [${sources
        .map((source) => `{name: "${source.name}",files:${source.files}},`)
        .join('')}]`,
      'utf8'
    )

    writeFileSync(
      path.join(process.cwd(), '/data/menu-sources.js'),
      `export const menuSources = [${sources
        .map((source) => `{name: "${source.name}",cover:${source.cover}},`)
        .join('')}]`,
      'utf8'
    )
  } catch (error) {
    console.error('Erreur lors de la lecture du dossier:', error)
  }

  console.log('generate done')
}

generate()
