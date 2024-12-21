import { AppRouter } from './providers/router'
import { StoreProvider } from './providers/store'

export const App = () => {
  return (
    <StoreProvider>
      <AppRouter />
    </StoreProvider>
  )
}
