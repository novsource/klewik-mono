import { forwardRef } from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format'

import { Input, InputProps } from '~shared/ui/input'

const NumberInput = forwardRef<
  HTMLInputElement,
  NumericFormatProps<InputProps>
>((props, forwardRef) => {
  return (
    <NumericFormat getInputRef={forwardRef} customInput={Input} {...props} />
  )
})

export default NumberInput
