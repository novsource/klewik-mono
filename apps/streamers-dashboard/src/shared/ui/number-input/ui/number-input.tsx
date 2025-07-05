import { forwardRef } from 'react'

import type { NumericFormatProps } from 'react-number-format'
import { NumericFormat } from 'react-number-format'

import type { InputProps } from '~shared/ui/input'
import { Input } from '~shared/ui/input'

export type NumberInputProps = NumericFormatProps<InputProps>

const NumberInput = forwardRef<
  HTMLInputElement,
  NumberInputProps
>((props, forwardRef) => {
  return (
    <NumericFormat getInputRef={forwardRef} customInput={Input} {...props} />
  )
})

export { NumberInput }
