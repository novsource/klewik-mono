import { useDispatch, useSelector } from 'react-redux'

import type { RootState, StoreDispatch } from './store'

export const useStoreDispatch = useDispatch.withTypes<StoreDispatch>()
export const useStoreSelector = useSelector.withTypes<RootState>()
