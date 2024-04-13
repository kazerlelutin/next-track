import {
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from 'fs'
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

const BASE_FOLDER = '_gen'

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

async function generate(folder) {
  console.log('---- Begin generate for', folder)

  const isExist = existsSync(path.join(process.cwd(), BASE_FOLDER))
  if (!isExist) mkdirSync(path.join(process.cwd(), BASE_FOLDER))

  // --- Lecture du dossier source
  const directoryPath = path.join(process.cwd(), '/public/' + folder)

  try {
    const files = readdirSync(directoryPath, { withFileTypes: true })

    const folderToExport = []

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

            // SVG ----------------------------------------------
            if (filePath.endsWith('.svg') && content.match(/<svg/)) {
              const name = fileRec.name.replace('.svg', '')

              files.push({
                name,
                fileName: name,
                type: 'svg',
                ext: 'svg',
                data: await extractDataFromSvg(filePath),
                url: `/${folder}/${file.name}/${fileRec.name}`,
              })
            }

            if (filePath.endsWith('.md')) {
              const [name, lang, ext] = fileRec.name.split('.')

              console.log(filePath)
              files.push({
                name,
                lang,
                ext,
                fileName: name,
                type: 'md',
                ext: 'md',
                url: `/${folder}/${file.name}/${fileRec.name}`,
              })
            }
          }
        }

        const fileName = `${folder}_${file.name}.js`
        const typeSourcePath = path.join(
          process.cwd(),
          `/${BASE_FOLDER}/${fileName}`
        )

        writeFileSync(
          typeSourcePath,
          `const ${file.name} = ${JSON.stringify(files)}\nexport default ${
            file.name
          }`,
          'utf8'
        )

        folderToExport.push({
          name: file.name,
          files: `import('./${fileName}').then((m) => m.default)`,
          cover:
            files.length > 0
              ? `"/${folder}/${file.name}/${files[0].name}.${files[0].ext}"`
              : 'null',
        })
      }
    }

    writeFileSync(
      path.join(process.cwd(), `/${BASE_FOLDER}/${folder}.js`),
      `const ${folder} = [${folderToExport
        .map((source) => `{name: "${source.name}",files:${source.files}},`)
        .join('')}]
        export default ${folder}
        `,
      'utf8'
    )

    writeFileSync(
      path.join(process.cwd(), `/${BASE_FOLDER}/menu-${folder}.js`),
      `const menu = [${folderToExport
        .map((source) => `{name: "${source.name}",cover:${source.cover}},`)
        .join('')}]
        export default menu`,
      'utf8'
    )
  } catch (error) {
    console.error('Erreur lors de la lecture du dossier:', error)
  }

  console.log('generate done')
}

async function generateLazyImports() {
  console.log('---- Begin generate lazy imports')
  const directoryPath = path.join(process.cwd(), BASE_FOLDER)
  const files = readdirSync(directoryPath, { withFileTypes: true })

  const imports = []
  for (const file of files) {
    if (file.isFile()) {
      imports.push({
        name: file.name.split('.')[0],
        file: `import('./${file.name}').then((m) => m.default)`,
      })
    }
  }

  writeFileSync(
    path.join(process.cwd(), `/${BASE_FOLDER}/index.js`),
    `const imports = [${imports
      .filter((i) => i.name !== 'index')
      .map((i) => `{name: "${i.name}",file:${i.file}},`)
      .join('')}]
    export default imports`,
    'utf8'
  )
}

async function start() {
  console.log('---- Read all directories in /public')
  const directoryPath = path.join(process.cwd(), '/public')
  const files = readdirSync(directoryPath, { withFileTypes: true })

  for (const file of files) {
    if (file.isDirectory()) {
      await generate(file.name)
    }
  }
  generateLazyImports()
}

start()
