import type { GlobalDialogsNames, GlobalDialogsSliceState } from '../store/global-dialogs.slice'

const dialogsNames: GlobalDialogsNames[] = ['createSlot', 'editSlot', 'mobileMenu', 'processDonation', 'search', 'settings']

export const DIALOGS_SLICE_INITIAL_STATE = dialogsNames.reduce((acc, name) => {
  acc[name] = {
    isOpen: false,
    initialData: null,
  }

  return acc
}, {} as GlobalDialogsSliceState)
