import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  ActionCreatorsMapObject,
  AsyncThunk,
  bindActionCreators,
} from '@reduxjs/toolkit'

export const useStoreDispatch = useDispatch.withTypes<StoreDispatch>()
export const useStoreSelector = useSelector.withTypes<RootState>()

type ThunkActionCreatorTypes<Thunk extends AsyncThunk<any, any, any>> = (
  ...args: Parameters<Thunk>
) => ReturnType<ReturnType<Thunk>>

type ActionCreatorsTypes<Actions extends ActionCreatorsMapObject> = {
  [K in keyof Actions]: Actions[K] extends AsyncThunk<any, any, any>
    ? ThunkActionCreatorTypes<Actions[K]>
    : Actions[K]
}

export const useActionCreators = <Actions extends ActionCreatorsMapObject>(
  actions: Actions
): ActionCreatorsTypes<Actions> => {
  const dispatch = useStoreDispatch()

  return useMemo(() => bindActionCreators(actions, dispatch), [])
}
