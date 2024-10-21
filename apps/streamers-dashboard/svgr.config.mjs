import {basename, extname} from 'path';
const outDir = './src/shared/components/ui/icons'; // путь, до папки, где будут храниться преобразованные иконки

// Шаблон компонента с иконкой
const iconTemplate = (variables, {tpl}) => tpl`
${variables.imports};

${variables.interfaces};

const ${variables.componentName} = (${variables.props}) => {

  return ${variables.jsx}
}

${variables.exports};
`;

// Шаблон файла index.ts, который будет экспортировать все сгенерированные компоненты иконок
function indexTemplate(files) {
  const compoundExportEntries = [];

  const importEntries = files.map((file) => {
    const componentName = basename(file.path, extname(file.path));
    compoundExportEntries.push(componentName);

    return `import { default as ${componentName} } from './${componentName}';`;
  });

  return `${importEntries.join('\n')}

    export const Icons = {
      ${compoundExportEntries.join(',\n  ')}
    };
  `;
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
};
