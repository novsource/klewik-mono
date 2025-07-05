type NullablePossible<T> = T | null

type SlotsStyles<SlotsNames extends string> = Partial<Record<SlotsNames, string | string[]>>
