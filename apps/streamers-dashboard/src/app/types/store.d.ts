declare type RootState = ReturnType<
  typeof import('../store/store').store.getState
>
declare type StoreDispatch
  = typeof import('../store/store').store.dispatch
