import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

import type { AuctionSlot } from '~entities/auction-slot/model'

import type { ProcessedDonation } from '~entities/donation/model'

import { DIALOGS_SLICE_INITIAL_STATE } from '../constants/slice-initial-state'

type GlobalDialogState<Data = unknown> = {
  isOpen: boolean
  initialData: Data
}

export type GlobalDialogsSliceState = {
  mobileMenu: GlobalDialogState
  search: GlobalDialogState
  editSlot: GlobalDialogState<NullablePossible<AuctionSlot>>
  processDonation: GlobalDialogState<NullablePossible<ProcessedDonation>>
  createSlot: GlobalDialogState
  settings: GlobalDialogState
}

export type GlobalDialogsNames = keyof GlobalDialogsSliceState

const globalDialogsSlice = createSlice({
  initialState: DIALOGS_SLICE_INITIAL_STATE,
  name: 'globalDialogs',
  reducers: {
    setDialogOpenStatus: (state, action: PayloadAction<{ dialog: GlobalDialogsNames, status: boolean }>) => {
      const { dialog, status } = action.payload

      state[dialog].isOpen = status
    },
    setDialogState: (state, action: PayloadAction<{ dialog: GlobalDialogsNames, data: GlobalDialogState }>) => {
      const { data, dialog } = action.payload

      // @ts-expect-error TODO: rework slice
      state[dialog] = data
    },
  },
  selectors: {
    getDialogState: (state, dialog: GlobalDialogsNames) => {
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
