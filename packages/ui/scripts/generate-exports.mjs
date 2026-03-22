import fs from 'fs'
import path from 'path'

const distPath = path.resolve('src/components/ui')
const packageJsonPath = path.resolve('package.json')

function getAllComponents(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const name = entry.name
      const fullPath = path.join(dir, name)

      const barrelIndexTs = path.join(fullPath, 'index.ts')

      if (fs.existsSync(barrelIndexTs)) {
        return name
      }

      return null
    })
    .filter(Boolean)
}

const components = getAllComponents(distPath)

const exportsMap = {
  '.': {
    import: './index.ts'
  }
}

for (const name of components) {
  exportsMap[`./${name}`] = {
    import: `./src/components/ui/${name}/index.ts`
  }
}


const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

pkg.exports = exportsMap

fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2))
