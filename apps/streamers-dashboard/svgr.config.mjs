import { basename, extname } from 'path'

const outDir = './src/shared/ui/icons' // путь, до папки, где будут храниться преобразованные иконки

// Шаблон компонента с иконкой
const iconTemplate = (
  { imports, interfaces, props, componentName, jsx, exports },
  { tpl }
) => tpl`
${imports};

${interfaces};

type Sizes = 'xs' | 'sm' | 'default' | 'lg'

type IconsProps = SVGProps<SVGSVGElement> & {
  size?: Sizes
}

const sizes: Record<Sizes, number> = {
  xs: 16,
  sm: 18,
  default: 21,
  lg: 24
}

const ${componentName} = (props: IconsProps) => {
  props = {...props, width: sizes[props.size] ?? props.width ?? sizes['default'], height: sizes[props.size] ?? props.height ?? sizes['default']}
  return ${jsx}
}

${exports};
`

// Шаблон файла index.ts, который будет экспортировать все сгенерированные компоненты иконок
function indexTemplate(files) {
  const compoundExportEntries = []

  const importEntries = files.map((file) => {
    const componentName = basename(file.path, extname(file.path))
    compoundExportEntries.push(componentName)

    return `import { default as ${componentName} } from './${componentName}';`
  })

  return `${importEntries.join('\n')}

    export const Icons = {
      ${compoundExportEntries.join(',\n  ')}
    };
  `
}

// Базовая настройка конфига
export default {
  typescript: true,
  icon: true,
  outDir,
  replaceAttrValues: {
    '#1C274C': 'currentColor',
  },
  ignoreExisting: true,
  prettier: false,
  indexTemplate,
  template: iconTemplate,
}
