import type { ReactNode } from 'react'

import { Provider } from 'react-redux'

import { rootStore } from './store'

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={rootStore}>
      {children}
    </Provider>
  )
}
