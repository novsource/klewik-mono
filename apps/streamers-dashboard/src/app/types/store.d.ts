declare type RootState = ReturnType<
  typeof import('../store/store').rootStore.getState
>
declare type StoreDispatch
  = typeof import('../store/store').rootStore.dispatch
