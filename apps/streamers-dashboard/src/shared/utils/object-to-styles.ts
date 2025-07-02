import { cn } from './cn'

export const twSlotsStyles = <StylesSlots extends string, T extends Record<StylesSlots, string>>
(stylesObject: T,
  extendedSlotsStyles?: Partial<Record<StylesSlots, string>>,
) => {
  return (Object.keys(stylesObject) as StylesSlots[]).reduce((acc, slotName) => {
    if (extendedSlotsStyles === undefined) {
      acc[slotName] = cn(stylesObject[slotName])
      return acc
    }

    const extendedSlotStyle = slotName in extendedSlotsStyles ? extendedSlotsStyles[slotName] : ''

    acc[slotName] = cn(stylesObject[slotName], extendedSlotStyle)

    return acc
  }, {} as Record<StylesSlots, string>)
}
