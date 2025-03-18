type SortingTypes = 'ascending' | 'descending'

type SlotsSortingOptions<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  field: keyof T
  type: SortingTypes
}

type AppStoreState = {
  slotsSortOptions: SlotsSortingOptions
}

export type { SlotsSortingOptions, AppStoreState, SortingTypes }
