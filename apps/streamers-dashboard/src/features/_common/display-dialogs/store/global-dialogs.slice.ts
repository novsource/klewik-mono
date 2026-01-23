import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

import type { AuctionSlot } from '~entities/auction-slot/model'

import type { ProcessedDonation } from '~entities/donation/model'

import { DIALOGS_SLICE_INITIAL_STATE } from '../constants/slice-initial-state'

type DialogState<Data> = {
  isOpen: boolean
  initialData: Data
}

export type GlobalDialogsSliceState = {
  mobileMenu: DialogState<null>
  search: DialogState<null>
  editSlot: DialogState<NullablePossible<AuctionSlot>>
  processDonation: DialogState<NullablePossible<ProcessedDonation>>
  createSlot: DialogState<null>
  settings: DialogState<null>
}

const globalDialogsSlice = createSlice({
  initialState: DIALOGS_SLICE_INITIAL_STATE,
  name: 'globalDialogs',
  reducers: {
    setDialogOpenStatus: (state, action: PayloadAction<{ dialog: keyof GlobalDialogsSliceState, status: boolean }>) => {
      const { dialog, status } = action.payload

      state[dialog].isOpen = status
    },
    setDialogState: <DialogName extends keyof GlobalDialogsSliceState>(state: GlobalDialogsSliceState, action: PayloadAction<{ dialog: DialogName, data: GlobalDialogsSliceState[DialogName] }>) => {
      const { data, dialog } = action.payload

      state[dialog] = data
    },
  },
  selectors: {
    getDialogState: (state, dialog: keyof GlobalDialogsSliceState) => {
      return state[dialog]
    },
    getAllDialogsStates: (state) => {
      return state
    },
  },
})

export const {
  reducer: globalDialogsReducer,
  actions: globalDialogsActions,
  selectors: globalDialogsSelectors,
} = globalDialogsSlice
