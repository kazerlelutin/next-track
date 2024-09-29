import fs from 'fs'
import path from 'path'

export async function createToml(context) {
  console.log('---- generate TOML', env?.KV_BINDING)

  const directoryPath = path.join(process.cwd())

  let tomlContent = `[[kv_namespaces]]\n`
  tomlContent += `binding = "${process.env.KV_BINDING}"\n`
  tomlContent += `id = "${process.env.KV_ID}"\n`
  tomlContent += `preview_id ="${process.env.KV_PREVIEW_ID}"\n`

  console.log(tomlContent)
  fs.writeFileSync(
    path.join(directoryPath, '/wrangler.toml'),
    tomlContent,
    'utf8'
  )
}
