import { createListenerMiddleware } from '@reduxjs/toolkit'

export const createStoreListenerMiddleware = () => {
  const instance = createListenerMiddleware()

  instance.startListening.withTypes<RootState, StoreDispatch>()
  instance.stopListening.withTypes<RootState, StoreDispatch>()

  return instance
}
