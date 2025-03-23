import {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'

import { Input, InputProps } from '~shared/ui/input'

import {
  deleteAllSpacesFromString,
  isStringContainNotOnlyNumbers,
} from '~shared/utils/string-format'

export type NumberInputProps = InputProps & {
  locales?: Intl.LocalesArgument
  numberFormat?: Intl.NumberFormatOptions
  minValue?: number
  maxValue?: number
  allowDeleteMinValue?: boolean
  onNumberChanges?: (formattedNumber: number | undefined) => void
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (props, forwardRef) => {
    const {
      onChange,
      onBlur,
      minValue,
      maxValue,
      allowDeleteMinValue = true,
      onNumberChanges,
      defaultValue,
      numberFormat,
      locales,
      ...otherProps
    } = props

    const innerRef = useRef<HTMLInputElement>(null)
    const inputValue = useRef<string>('')

    useImperativeHandle(forwardRef, () => innerRef.current as HTMLInputElement)

    const defaultInputValue = useMemo(() => {
      if (!Number.isInteger(minValue)) return ''

      return Intl.NumberFormat(locales ?? 'ru-RU', numberFormat).format(
        Number(defaultValue ?? minValue)
      )
    }, [defaultValue, minValue])

    const formatValue = useCallback(
      (str: string) => {
        const stringWithoutSpaces = deleteAllSpacesFromString(str)

        const containNotOnlyNumbers =
          isStringContainNotOnlyNumbers(stringWithoutSpaces)

        if (!containNotOnlyNumbers && stringWithoutSpaces.length !== 0) {
          const value = Number(stringWithoutSpaces)

          let formatedValue = ''

          const max = maxValue ?? Number.MAX_SAFE_INTEGER

          if (value > max) {
            formatedValue = new Intl.NumberFormat('ru-RU').format(max)
            onNumberChanges && onNumberChanges(max)
          } else {
            formatedValue = new Intl.NumberFormat('ru-RU').format(value)
            onNumberChanges && onNumberChanges(value)
          }

          inputValue.current = formatedValue
        }

        if (stringWithoutSpaces.length === 0) {
          inputValue.current = ''
          onNumberChanges && onNumberChanges(undefined)
        }

        if (
          stringWithoutSpaces.length === 0 &&
          minValue &&
          !allowDeleteMinValue
        ) {
          inputValue.current = new Intl.NumberFormat(
            locales ?? 'ru-RU',
            numberFormat
          ).format(Number(minValue))
          onNumberChanges && onNumberChanges(minValue)
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

    const onBlurHandler = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        if (!innerRef.current) return

        const stringWithoutSpaces = deleteAllSpacesFromString(
          inputValue.current
        )

        const min = minValue ?? Number.MIN_SAFE_INTEGER

        if (
          stringWithoutSpaces.length === 0 &&
          minValue &&
          Number.isInteger(min)
        ) {
          innerRef.current.value = min.toString()
          onNumberChanges && onNumberChanges(min)
        } else if (stringWithoutSpaces.length !== 0 && minValue) {
          const value =
            Number(stringWithoutSpaces) < min
              ? Intl.NumberFormat(locales ?? 'ru-RU', numberFormat).format(
                  Number(min)
                )
              : inputValue.current

          innerRef.current.value = value

          onNumberChanges &&
            onNumberChanges(
              Number(stringWithoutSpaces) < min
                ? min
                : Number(stringWithoutSpaces)
            )
        }

        onBlur && onBlur(e)
      },
      [onBlur, inputValue.current, innerRef.current]
    )

    return (
      <Input
        ref={innerRef}
        type="text"
        defaultValue={defaultInputValue}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        {...otherProps}
      />
    )
  }
)

export default NumberInput
