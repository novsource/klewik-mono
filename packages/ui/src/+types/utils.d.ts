type Maybe<T> = NonNullable<T> | undefined
type NullablePossible<T> = T | null

type SlotClassname<Name extends string> = {
  slotClassnames?: {
    [key in Name]?: string
  }
}

type ExtractComponentClassnameToSlot<InputProps extends Record<string, any>, SlotName extends string, PropsName extends string = undefined> = PropsName extends undefined
  ? Omit<InputProps, 'className'> & SlotClassname<SlotName>
  : SlotClassname<SlotName> & {
    [key in PropsName]?: Omit<InputProps, 'className'>
  }
