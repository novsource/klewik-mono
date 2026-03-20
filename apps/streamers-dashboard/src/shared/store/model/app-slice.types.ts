type SortingTypes = 'ascending' | 'descending'

type SortingOptions<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  field: keyof T
  type: SortingTypes
}

type TimerSettings = {
  initial: {
    seconds: number
    minutes: number
  }
  addedTimeValue: number
  decreaseTimeValue: number
  onEndAction?: () => void
}

type AppStoreState = {
  timerSettings: TimerSettings
}

export type {
  AppStoreState,
  SortingOptions,
  SortingTypes,
  TimerSettings,
}
