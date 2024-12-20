import { useDispatch, useSelector } from 'react-redux'

export const useStoreDispatch = useDispatch.withTypes<StoreDispatch>()
export const useStoreSelector = useSelector.withTypes<RootState>()
