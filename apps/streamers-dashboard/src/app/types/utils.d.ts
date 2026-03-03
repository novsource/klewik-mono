import type { ComponentPropsWithoutRef } from 'react'

declare const __brand: unique symbol

type NullablePossible<T> = T | null
type Maybe<T> = T | undefined

type SlotsStyles<SlotsNames extends string> = Partial<Record<SlotsNames, string | string[]>>

type Brand<T, B extends string | symbol> = T & {
  [__brand]: B
}

type SlotClassname<Name extends string> = {
  slotClassnames?: {
    [key in Name]?: string
  }
}

type ExtractComponentClassnameToSlot<InputProps extends ComponentPropsWithoutRef, SlotName extends string, PropsName extends string = undefined> = PropsName extends undefined
  ? Omit<InputProps, 'className'> & SlotClassname<SlotName>
  : SlotClassname<SlotName> & {
    [key in PropsName]?: Omit<InputProps, 'className'>
  }
