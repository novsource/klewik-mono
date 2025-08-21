import type { ReactNode } from 'react'

import { Provider } from 'react-redux'

import { PersistGate } from 'redux-persist/es/integration/react'

import { persistor, store } from './store'

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
