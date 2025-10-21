import type { KeyboardEvent, ReactNode } from 'react'
import { useMemo, useState } from 'react'

import type {
  FieldPath,
  FieldValues,
  UseControllerProps,
} from 'react-hook-form'
import { useController } from 'react-hook-form'

import { mergeProps } from '@base-ui-components/react'

import type { AuctionSlot } from '~entities/auction-slot/model'

import { useIsFirstRender } from '~shared/hooks'

import type {
  AutocompleteInputProps,
  AutocompleteProps,
  AutocompleteTag,
} from '~shared/ui/autocomplete'
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
} from '~shared/ui/autocomplete'
import type { InputProps } from '~shared/ui/input'
import { Typography } from '~shared/ui/typograghy'

import { cn, isFunction } from '~shared/utils'

type FormControllerProps<
  FormFields extends FieldValues | Record<string, FieldValues>,
  Paths extends FieldPath<FormFields>,
  TransformedValues extends FormFields = FormFields,
> = UseControllerProps<FormFields, Paths, TransformedValues>

const preventEnterFn = (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.which === 13 /* Enter */) {
    event.preventDefault()
  }
}

const convertAuctionSlotItemsToTags = (items: AuctionSlot[]) => {
  return items.map<AutocompleteTag>(item => ({
    id: item.id.toString(),
    value: item.title,
  }))
}

export type ProcessedDonationSlotTitleFormInputProps<
  FormFields extends FieldValues | Record<string, FieldValues>,
  Paths extends FieldPath<FormFields>,
  TransformedValues extends FormFields,
> = Omit<AutocompleteProps, 'items'> & {
  children?: (tag: AutocompleteTag) => ReactNode
  formControllerProps: FormControllerProps<
    FormFields,
    Paths,
    TransformedValues
  >
  inputProps?: AutocompleteInputProps
  items?: AuctionSlot[]
  maxLength?: number
}

export const ProcessedDonationSlotTitleFormInput = <
  FormFields extends FieldValues | Record<string, FieldValues>,
  Paths extends FieldPath<FormFields>,
  TransformedValues extends FormFields,
>(
  props: ProcessedDonationSlotTitleFormInputProps<
    FormFields,
    Paths,
    TransformedValues
  >,
) => {
  const {
    items,
    children,
    formControllerProps,
    inputProps,
    maxLength = 35,
    ...restProps
  } = props

  const [isFocused, setIsFocused] = useState(false)
  const [boundAnimationStatus, setBoundAnimationStatus] = useState<
    'inactive' | 'active'
  >('inactive')

  const {
    field: { onChange: fieldOnChange, value: fieldValue, ...field },
  } = useController(formControllerProps)

  const [value, setValue] = useState(() => {
    return fieldValue
  })

  const isFirstRender = useIsFirstRender()

  if (!isFirstRender && value !== fieldValue) {
    setValue(fieldValue)
  }

  const handleOnChange = (targetValue: string) => {
    if (targetValue.length > maxLength) {
      fieldOnChange(targetValue.slice(0, maxLength))
      setBoundAnimationStatus('active')
    }
    else {
      fieldOnChange(targetValue)
      setBoundAnimationStatus('inactive')
    }
  }

  const autocompleteTags = useMemo(
    () => convertAuctionSlotItemsToTags(items ?? []),
    [items],
  )

  const inputHandlers: InputProps = {
    onChange: event => handleOnChange(event.target.value),
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    onKeyDown: preventEnterFn,
  }

  const mergedInputProps = mergeProps(inputHandlers, inputProps)

  return (
    <Autocomplete
      items={autocompleteTags}
      onValueChange={value => handleOnChange(value)}
      value={value}
      {...restProps}
    >
      <AutocompleteInput
        variant="ghost"
        placeholder="Название слота"
        slotClassNames={{
          base: 'w-full basis-1/2 grow',
          wrapper: !isFocused && 'pl-0.5',
          description: 'text-wrap',
        }}
        endContent={
          isFocused
            ? (
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
              )
            : undefined
        }
        {...field}
        {...mergedInputProps}
      />
      <AutocompleteContent showEmpty={false}>
        {(tag) => {
          if (isFunction(children))
            return children(tag)
          return (
            <AutocompleteItem tag={tag} key={tag.id}>
              {tag.value}
            </AutocompleteItem>
          )
        }}
      </AutocompleteContent>
    </Autocomplete>
  )
}
