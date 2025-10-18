import type { ChangeEvent, KeyboardEvent } from 'react'
import { useState } from 'react'

import { useController } from 'react-hook-form'
import type { FieldPath, FieldValues, UseControllerProps } from 'react-hook-form'

import { useIsFirstRender } from '~shared/hooks'

import { Input } from '~shared/ui/input'
import type { InputProps } from '~shared/ui/input'
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
  TransformedValues extends FormFields,
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

  const [boundAnimationStatus, setBoundAnimationStatus] = useState<
    'inactive' | 'active'
  >('inactive')

  const { field: { onChange: fieldOnChange, value: fieldValue, ...field } } = useController({
    name,
    control,
  })

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
      setBoundAnimationStatus('active')
    }
    else {
      fieldOnChange(event.target.value)
      setBoundAnimationStatus('inactive')
    }
  }

  const inputHandlers: InputProps = { onChange: handleOnChange, onKeyDown: preventEnterFn }

  const mergedInputProps = mergeProps(inputHandlers, inputProps)

  return (
    <Input
      label={{ id: `${name}`, value: 'Название слота' }}
      placeholder="Название слота"
      slotClassNames={{
        base: 'w-full basis-1/2 grow',
        description: 'text-wrap',
      }}
      value={value}
      endContent={(
        <Typography
          tag="span"
          className={cn(
            'text-md transition-colors select-none',
            boundAnimationStatus === 'active'
              ? 'animate-horizontal-shaking text-red'
              : 'text-gray-light',
          )}
          onAnimationEnd={() => {
            setBoundAnimationStatus('inactive')
          }}
        >
          {`${value.toString().length}/${maxLength}`}
        </Typography>
      )}
      {...field}
      {...mergedInputProps}
    />
  )
}
