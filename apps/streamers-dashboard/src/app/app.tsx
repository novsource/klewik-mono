import { LazyMotion, domAnimation } from 'motion/react'

import { AppRouter } from './providers/router'
import { StoreProvider } from './providers/store'

export const App = () => {
  return (
    <StoreProvider>
      <LazyMotion features={domAnimation}>
        <AppRouter />
      </LazyMotion>
    </StoreProvider>
  )
}
