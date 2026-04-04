'use client'

import { forwardRef } from 'react'

import type { NumberFormatValues, NumericFormatProps } from 'react-number-format'
import { NumericFormat } from 'react-number-format'

import type { InputProps } from '../../input'
import { Input } from '../../input'

import { isStringEmpty } from '../../../../utils/index'

import { isNumberInputValueInsideBounds } from '../utils/number-bounds'

export type NumberInputProps = NumericFormatProps<InputProps> & {
  valueBounds?: { min?: number, max?: number }
  allowEmptyWithValidating?: boolean
}

export const NumberInput = forwardRef<
  HTMLInputElement,
  NumberInputProps
>((props, forwardRef) => {
  const {
    isAllowed,
    allowNegative,
    valueBounds,
    allowEmptyWithValidating = true,
    ...restProps
  } = props

  const handleAllowedChecking = (values: NumberFormatValues) => {
    const isEmptyInput = !values.floatValue && isStringEmpty(values.formattedValue) && isStringEmpty(values.value)

    if (isEmptyInput && allowEmptyWithValidating) {
      return true
    }

    if (isAllowed !== undefined) {
      return isAllowed(values)
    }

    if (valueBounds) {
      const safeMinValue = allowNegative ? Number.MIN_SAFE_INTEGER : 0
      const safeMaxValue = Number.MAX_SAFE_INTEGER

      return isNumberInputValueInsideBounds(values, { min: valueBounds.min ?? safeMinValue, max: valueBounds.max ?? safeMaxValue })
    }

    return true
  }

  return (
    <NumericFormat
      getInputRef={forwardRef}
      customInput={Input}
      isAllowed={handleAllowedChecking}
      allowNegative={allowNegative}
      {...restProps}
    />
  )
})
