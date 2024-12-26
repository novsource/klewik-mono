import { ChangeEvent, forwardRef, useCallback, useRef } from 'react'

import { Input, InputProps } from '~shared/ui/input'
import {
  deleteAllSpacesFromString,
  isStringContainNotOnlyNumbers,
} from '~shared/utils/string-format'

const NumberInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { onChange, ...otherProps } = props

  const inputValue = useRef<string>('')

  const onChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const stringWithoutSpaces = deleteAllSpacesFromString(e.target.value)

      const containNotOnlyNumbers =
        isStringContainNotOnlyNumbers(stringWithoutSpaces)

      if (!containNotOnlyNumbers && stringWithoutSpaces.length !== 0) {
        inputValue.current = new Intl.NumberFormat('ru-RU').format(
          Number(stringWithoutSpaces)
        )
      }

      if (stringWithoutSpaces.length === 0) {
        inputValue.current = ''
      }

      e.target.value = inputValue.current

      onChange && onChange(e)
    },
    [onChange]
  )

  return (
    <Input ref={ref} type="text" onChange={onChangeHandler} {...otherProps} />
  )
})

export default NumberInput
