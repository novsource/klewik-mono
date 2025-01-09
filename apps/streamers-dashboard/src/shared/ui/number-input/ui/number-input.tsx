import { ChangeEvent, forwardRef, useCallback, useRef } from 'react'

import { Input, InputProps } from '~shared/ui/input'

import {
  deleteAllSpacesFromString,
  isStringContainNotOnlyNumbers,
} from '~shared/utils/string-format'

type NumberInputProps = InputProps & {
  locales?: Intl.LocalesArgument
  numberFormat?: Intl.NumberFormat
  minValue?: number
  maxValue?: number
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (props, ref) => {
    const { onChange, minValue, maxValue, ...otherProps } = props

    const inputValue = useRef<string>('')

    const formatValue = useCallback(
      (str: string) => {
        const stringWithoutSpaces = deleteAllSpacesFromString(str)

        const containNotOnlyNumbers =
          isStringContainNotOnlyNumbers(stringWithoutSpaces)

        if (!containNotOnlyNumbers && stringWithoutSpaces.length !== 0) {
          const value = Number(stringWithoutSpaces)

          let formatedValue = ''

          const min = minValue ?? Number.MIN_SAFE_INTEGER
          const max = maxValue ?? Number.MAX_SAFE_INTEGER

          if (value < min) {
            formatedValue = new Intl.NumberFormat('ru-RU').format(min)
          }
          if (value > max) {
            formatedValue = new Intl.NumberFormat('ru-RU').format(max)
          }

          if (value >= min && value <= max) {
            formatedValue = new Intl.NumberFormat('ru-RU').format(value)
          }

          inputValue.current = formatedValue
        }

        if (stringWithoutSpaces.length === 0) {
          inputValue.current = ''
        }

        if (stringWithoutSpaces.length === 0 && minValue) {
          inputValue.current = new Intl.NumberFormat('ru-RU').format(
            Number(minValue)
          )
        }

        return inputValue.current
      },
      [minValue, maxValue]
    )

    const onChangeHandler = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        e.target.value = formatValue(e.target.value)

        onChange && onChange(e)
      },
      [onChange]
    )

    return (
      <Input ref={ref} type="text" onChange={onChangeHandler} {...otherProps} />
    )
  }
)

export default NumberInput
