type NullablePossible<T> = T | null
type Maybe<T> = T | undefined

type SlotsStyles<SlotsNames extends string> = Partial<Record<SlotsNames, string | string[]>>
