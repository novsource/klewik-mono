import { Provider } from 'react-redux'

import { AppRouter } from './shared/router/RouterProvider'
import { store } from './shared/store/store'

function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  )
}

export default App
