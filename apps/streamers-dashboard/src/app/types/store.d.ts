declare type RootState = ReturnType<
  typeof import('../providers/store/store').store.getState
>
declare type StoreDispatch =
  typeof import('../providers/store/store').store.dispatch
