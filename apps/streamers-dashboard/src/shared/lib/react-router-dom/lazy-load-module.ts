/**
 * Lazy component loading for React Router
 * @description If warning, read this title: https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
 * @param modulePath
 */

export const lazyLoadModule = async (modulePath: string) => {
  if (modulePath === '' || modulePath.length === 0) {
    throw Error()
  }

  /* @vite-ignore */
  const comp = await import(`${modulePath}.tsx`)

  const moduleProps = Object.getOwnPropertyNames(comp)
  const isDefaultImport = moduleProps.includes('default')

  const loadedModule = isDefaultImport ? comp.default : comp[moduleProps[0]]

  return {
    Component: loadedModule,
  }
}
