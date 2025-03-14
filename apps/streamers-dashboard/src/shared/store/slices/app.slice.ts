import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { AppStoreState, SlotsSortingOptions } from '../model'

const initialState: AppStoreState = {
  slotsSortOptions: {
    field: '',
    type: 'descending',
  },
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSlotsSortOptions(state, action: PayloadAction<SlotsSortingOptions>) {
      state.slotsSortOptions = action.payload
    },
  },
  selectors: {
    getSlotsSortOptions: (state) => {
      return state.slotsSortOptions
    },
  },
})

export const {
  reducer: appReducer,
  actions: appActions,
  selectors: appSelectors,
} = appSlice
