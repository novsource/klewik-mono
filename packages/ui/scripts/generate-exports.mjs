import fs from 'fs'
import path from 'path'

const distPath = path.resolve('dist/components/ui')
const packageJsonPath = path.resolve('package.json')

function getAllComponents(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const name = entry.name
      const fullPath = path.join(dir, name)

      const indexJs = path.join(fullPath, 'index.js')
      const indexDts = path.join(fullPath, 'index.d.ts')

      if (fs.existsSync(indexJs) && fs.existsSync(indexDts)) {
        return name
      }

      return null
    })
    .filter(Boolean)
}

const components = getAllComponents(distPath)

const exportsMap = {
  '.': {
    types: './dist/index.d.ts',
    import: './dist/index.js'
  }
}

for (const name of components) {
  exportsMap[`./${name}`] = {
    types: `./dist/components/ui/${name}/index.d.ts`,
    import: `./dist/components/ui/${name}/index.js`
  }
}


const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

pkg.exports = exportsMap

fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2))
