type SortingTypes = 'ascending' | 'descending'

type SlotsSortingOptions = {
  field: string
  type: SortingTypes
}

type AppStoreState = {
  slotsSortOptions: SlotsSortingOptions
}

export type { SlotsSortingOptions, AppStoreState, SortingTypes }
