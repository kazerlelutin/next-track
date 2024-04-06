const fs = require('fs')
const path = require('path')

function createTemplate(id) {
  const templateContent = [`<template id="${id}">`, `\n\n`, `</template>`].join(
    ''
  )

  const templateFolder = path.resolve(process.cwd(), `./templates`)
  const indexTemplate = path.resolve(
    process.cwd(),
    `./templates/index.js`
  )

  if (!fs.existsSync(templateFolder)) {
    fs.mkdirSync(templateFolder)
  }

  const pathFile = path.resolve(process.cwd(), `./templates/${id}.html`)

  if (fs.existsSync(pathFile)) {
    console.log(`\n${key} already exist`)
    return
  }

  fs.writeFileSync(pathFile, templateContent)

  const indexContent = fs.readFileSync(indexTemplate, 'utf8')
  const indexContentArray = indexContent.split('\n')
  indexContentArray.splice(
    indexContentArray.length,
    0,
    `export * as ${id} from "./${id}.html?raw"`
  )

  fs.writeFileSync(indexTemplate, indexContentArray.join('\n'))
}

module.exports = {
  createTemplate
}
