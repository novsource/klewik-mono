import { createListenerMiddleware } from '@reduxjs/toolkit'

const createStoreListenerMiddleware = () => {
  const instance = createListenerMiddleware()

  instance.startListening.withTypes<RootState, StoreDispatch>()
  instance.stopListening.withTypes<RootState, StoreDispatch>()

  return instance
}

export { createStoreListenerMiddleware }
