'use client'

import type { ChangeEvent, ComponentProps, ReactNode } from 'react'
import { useMemo } from 'react'

import { mergeProps } from '@base-ui/react'
import { Autocomplete as PrimitiveAutocomplete } from '@base-ui/react/autocomplete'

import type { InputProps } from '~components/ui/input'
import { Input } from '~components/ui/input'

import { cn } from '~utils/index'

import { AutocompleteContextProvider, useAutocompleteContext } from '../context/autocomplete-context'
import {
  autocompleteEmptyVariants,
  autocompleteItemVariants,
  autocompletePopupVariants,
} from '../styles/autocomplete-variants'

export type AutocompleteTag = {
  id: string
  value: string
}

export type AutocompleteItemProps = ComponentProps<typeof PrimitiveAutocomplete.Item> & {
  tag: AutocompleteTag
}

export const AutocompleteItem = (props: AutocompleteItemProps) => {
  const { className, tag, ...restProps } = props

  const classes = useMemo(() => cn(autocompleteItemVariants(), className), [className])

  return (
    <PrimitiveAutocomplete.Item
      className={classes}
      value={tag}
      {...restProps}
    >
      {tag.value}
    </PrimitiveAutocomplete.Item>
  )
}

type AutocompleteEmptyProps = PrimitiveAutocomplete.Empty.Props

export type AutocompleteContentProps = {
  children: (tag: AutocompleteTag) => ReactNode | ReactNode[] | ReactNode
  popupProps?: Omit<PrimitiveAutocomplete.Popup.Props, 'children'>
  emptyProps?: AutocompleteEmptyProps
  positionerProps?: PrimitiveAutocomplete.Positioner.Props
  showEmpty?: boolean
}

export const AutocompleteContent = (props: AutocompleteContentProps) => {
  const {
    children,
    popupProps,
    emptyProps,
    positionerProps,
    showEmpty = true,
  } = props

  const { query, items } = useAutocompleteContext()

  const { contains } = PrimitiveAutocomplete.useFilter({ sensitivity: 'base' })

  const isShouldRenderPopup = useMemo(() => {
    if (!query)
      return false

    return items.some((item) => {
      const is = contains(item.value, query)
      return is
    })
  }, [items, query])

  const mergedPopupProps = mergeProps<typeof PrimitiveAutocomplete.Popup>(popupProps, {
    className: autocompletePopupVariants(),
  })
  const mergedEmptyProps = mergeProps<typeof PrimitiveAutocomplete.Empty>(emptyProps, {
    className: autocompleteEmptyVariants(),
  })
  const mergedPositionerProps = mergeProps<typeof PrimitiveAutocomplete.Positioner>(positionerProps, {
    className: 'outline-none z-50',
    sideOffset: 4,
  })

  if (!isShouldRenderPopup && !showEmpty)
    return

  return (
    <PrimitiveAutocomplete.Portal>
      <PrimitiveAutocomplete.Positioner {...mergedPositionerProps}>
        <PrimitiveAutocomplete.Popup {...mergedPopupProps}>
          <PrimitiveAutocomplete.Empty {...mergedEmptyProps}>
            No data
          </PrimitiveAutocomplete.Empty>
          <PrimitiveAutocomplete.List>
            {children}
          </PrimitiveAutocomplete.List>
        </PrimitiveAutocomplete.Popup>
      </PrimitiveAutocomplete.Positioner>
    </PrimitiveAutocomplete.Portal>

  )
}

export type AutocompleteInputProps = Omit<InputProps, 'ref'> & {
  autocompleteProps?: Omit<PrimitiveAutocomplete.Input.Props, 'render'>
}

export const AutocompleteInput = (props: AutocompleteInputProps) => {
  const { autocompleteProps, ...restProps } = props

  const { setQuery } = useAutocompleteContext()

  const handleOnInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setQuery(value)
  }

  const mergedInputProps = mergeProps<typeof Input>(restProps, {
    onChange: handleOnInputChange,
  })

  return (
    <PrimitiveAutocomplete.Input
      render={<Input {...mergedInputProps} />}
      {...autocompleteProps}
    />
  )
}

export type AutocompleteProps = Omit<PrimitiveAutocomplete.Root.Props<AutocompleteTag>, 'items'> & {
  items: AutocompleteTag[]
}

export const Autocomplete = (props: AutocompleteProps) => {
  return (
    <AutocompleteContextProvider items={props.items}>
      <PrimitiveAutocomplete.Root {...props} />
    </AutocompleteContextProvider>
  )
}
