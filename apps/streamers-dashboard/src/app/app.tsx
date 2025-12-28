import { domAnimation, LazyMotion } from 'motion/react'

import { AppRouter } from './routing'
import { StoreProvider } from './store/store-provider'

export const App = () => {
  return (
    <StoreProvider>
      <LazyMotion features={domAnimation}>
        <AppRouter />
      </LazyMotion>
    </StoreProvider>
  )
}
