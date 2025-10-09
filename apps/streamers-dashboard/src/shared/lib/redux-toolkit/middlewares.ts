import { createListenerMiddleware } from '@reduxjs/toolkit'

export const appListenerMiddleware = createListenerMiddleware()

export const startAppListening = appListenerMiddleware.startListening.withTypes<RootState, StoreDispatch>()
export const stopAppListening = appListenerMiddleware.stopListening.withTypes<RootState, StoreDispatch>()
