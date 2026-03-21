import type { NumberFormatValues } from 'react-number-format'

export const isNumberInputValueInsideBounds = (value: NumberFormatValues, bounds: { min: number, max: number }) => {
  const checkedValue = value.floatValue

  if (checkedValue === undefined)
    return false

  if ((bounds.min <= checkedValue) && (checkedValue <= bounds.max)) {
    return true
  }

  return false
}
