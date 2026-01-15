declare const __brand: unique symbol

type NullablePossible<T> = T | null
type Maybe<T> = T | undefined

type SlotsStyles<SlotsNames extends string> = Partial<Record<SlotsNames, string | string[]>>

type Brand<T, B extends string | symbol> = T & {
  [__brand]: B
}
