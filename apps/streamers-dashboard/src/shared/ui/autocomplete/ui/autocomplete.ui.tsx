import type { ComponentProps, ReactNode } from 'react'
import { useMemo } from 'react'

import { mergeProps, Autocomplete as PrimitiveAutocomplete } from '@base-ui-components/react'

import type { InputProps } from '~shared/ui/input'
import { Input } from '~shared/ui/input'

import { cn } from '~shared/utils'

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
  const { className, value, tag, ...restProps } = props

  const styles = useMemo(() => cn(autocompleteItemVariants(), className), [className])

  return (
    <PrimitiveAutocomplete.Item
      className={styles}
      value={tag}
      {...restProps}
    >
      {tag.value}
    </PrimitiveAutocomplete.Item>
  )
}

type AutocompleteEmptyProps = PrimitiveAutocomplete.Empty.Props

export type AutocompleteContentProps = Omit<PrimitiveAutocomplete.Popup.Props, 'children'> & {
  emptyProps?: AutocompleteEmptyProps
  positionerProps?: PrimitiveAutocomplete.Positioner.Props
  showEmpty?: boolean
  children: (tag: AutocompleteTag) => ReactNode | ReactNode[] | ReactNode
}

export const AutocompleteContent = (props: AutocompleteContentProps) => {
  const {
    children,
    emptyProps,
    positionerProps,
    showEmpty = true,
    ...restProps
  } = props

  const mergedPopupProps = mergeProps<typeof PrimitiveAutocomplete.Popup>(restProps, {
    className: autocompletePopupVariants(),
  })
  const mergedEmptyProps = mergeProps<typeof PrimitiveAutocomplete.Empty>(emptyProps, {
    className: autocompleteEmptyVariants(),
  })
  const mergedPositionerProps = mergeProps<typeof PrimitiveAutocomplete.Positioner>(positionerProps, {
    className: 'outline-none z-50',
    sideOffset: 4,
  })

  return (
    <PrimitiveAutocomplete.Portal>
      <PrimitiveAutocomplete.Positioner {...mergedPositionerProps}>
        <PrimitiveAutocomplete.Popup {...mergedPopupProps}>
          {showEmpty && (
            <PrimitiveAutocomplete.Empty {...mergedEmptyProps}>
              No data
            </PrimitiveAutocomplete.Empty>
          )}
          <PrimitiveAutocomplete.List>
            {children}
          </PrimitiveAutocomplete.List>
        </PrimitiveAutocomplete.Popup>
      </PrimitiveAutocomplete.Positioner>
    </PrimitiveAutocomplete.Portal>
  )
}

export type AutocompleteInputProps = InputProps & {
  autocompleteProps?: Omit<PrimitiveAutocomplete.Input.Props, 'render'>
}

export const AutocompleteInput = (props: AutocompleteInputProps) => {
  const { autocompleteProps, ...restProps } = props

  return <PrimitiveAutocomplete.Input render={<Input {...restProps} />} {...autocompleteProps} />
}

export type AutocompleteProps = Omit<PrimitiveAutocomplete.Root.Props<AutocompleteTag>, 'items'> & {
  items: readonly AutocompleteTag[]
}

export const Autocomplete = (props: AutocompleteProps) => {
  return <PrimitiveAutocomplete.Root {...props} />
}
