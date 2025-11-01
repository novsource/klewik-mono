import type { ChangeEvent, KeyboardEvent } from 'react'
import { useState } from 'react'

import { useController } from 'react-hook-form'
import type { FieldPath, FieldValues, UseControllerProps } from 'react-hook-form'

import { useIsFirstRender } from '~shared/hooks'

import { Input } from '~shared/ui/input'
import type { InputProps } from '~shared/ui/input'
import type { TypographyProps } from '~shared/ui/typograghy'
import { Typography } from '~shared/ui/typograghy'

import { cn, mergeProps } from '~shared/utils'

const preventEnterFn = (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.which === 13 /* Enter */) {
    event.preventDefault()
  }
}

export const SlotTitleFormInput = <
  FormFields extends FieldValues,
  Paths extends FieldPath<FormFields>,
  TransformedValues,
>(props: InputProps
  & UseControllerProps<FormFields, Paths, TransformedValues> & {
    maxLength?: number
  }) => {
  const {
    control,
    name,
    maxLength = 35,
    value: inputValue,
    ...inputProps
  } = props

  const [isBoundAnimationActive, setIsBoundAnimationActive] = useState(false)

  const {
    field: {
      onChange: fieldOnChange,
      value: fieldValue,
      ...field
    },
  } = useController({ name, control })

  const [value, setValue] = useState(() => {
    if (inputValue) {
      fieldOnChange(inputValue)
      return inputValue
    }

    return fieldValue
  })

  const isFirstRender = useIsFirstRender()

  if (!isFirstRender && value !== fieldValue) {
    setValue(fieldValue)
  }

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > maxLength) {
      fieldOnChange(event.target.value.slice(0, maxLength))
      setIsBoundAnimationActive(true)
    }
    else {
      fieldOnChange(event.target.value)
      setIsBoundAnimationActive(false)
    }
  }

  const inputHandlers: InputProps = { onChange: handleOnChange, onKeyDown: preventEnterFn }
  const mergedInputProps = mergeProps(inputHandlers, inputProps, field)

  return (
    <Input
      label={{ id: `${name}`, value: 'Название слота' }}
      placeholder="Название слота"
      slotClassNames={{
        base: 'w-full basis-1/2 grow',
        description: 'text-wrap',
      }}
      value={fieldValue}
      endContent={(
        <TitleFormInputCharsCounter
          value={fieldValue.toString()}
          maxLength={maxLength}
          isActive={isBoundAnimationActive}
          onAnimationEnd={() => {
            setIsBoundAnimationActive(false)
          }}
        />
      )}
      {...mergedInputProps}
    />
  )
}

type TitleFormInputCharsCounterProps = Omit<TypographyProps<'span'>, 'tag' | 'children'> & {
  value: string
  maxLength: number
  isActive: boolean
}

function TitleFormInputCharsCounter(props: TitleFormInputCharsCounterProps) {
  const { value, maxLength, isActive, className, ...restProps } = props

  return (
    <Typography
      tag="span"
      className={cn(
        'text-md transition-colors select-none',
        isActive
          ? 'animate-horizontal-shaking text-red'
          : 'text-gray-light',
        className,
      )}
      {...restProps}
    >
      {`${value.length}/${maxLength}`}
    </Typography>
  )
}
