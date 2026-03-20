import type { DrawerSide, DrawerSize } from '../styles/drawer.variants'

import { createReactContext } from '~utils/cn'

type DrawerContextValue = {
  styles: {
    side: DrawerSide
    size: DrawerSize
  }
}

export const [DrawerContextProvider, useDrawerContext] = createReactContext<DrawerContextValue>({
  contextName: 'DrawerContext',
  providerName: 'DrawerContextProvider',
  hookName: 'useDrawerContext',
})
