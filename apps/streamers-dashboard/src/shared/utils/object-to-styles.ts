import { cn } from './cn'

export const twSlotsStyles = <T extends SlotsStyles<string>, SlotsNames extends keyof T>
(stylesObject: T,
  extendedSlotsStyles?: Partial<T>,
): Record<SlotsNames, string> => {
  return (Object.keys(stylesObject) as SlotsNames[]).reduce((acc, slotName) => {
    if (extendedSlotsStyles === undefined) {
      acc[slotName] = cn(stylesObject[slotName])
      return acc
    }

    const extendedSlotStyle = slotName in extendedSlotsStyles ? extendedSlotsStyles[slotName] : ''

    acc[slotName] = cn(stylesObject[slotName], extendedSlotStyle)

    return acc
  }, {} as Record<SlotsNames, string>)
}
