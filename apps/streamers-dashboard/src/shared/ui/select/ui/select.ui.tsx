import type { SelectContextState } from '../context'

import * as React from 'react'

import { Select as SelectPrimitive } from '@base-ui/react/select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

import { cn } from '~shared/utils'

import {
  SelectProvider,
  useSelectContext,
} from '../context'
import {
  selectItemVariants,
  selectListVariants,
  selectPopupVariants,
  selectPositionerVariants,
  selectScrollDownButtonVariants,
  selectScrollUpButtonVariants,
  selectSeparatorVariants,
  selectTriggerVariants,
} from '../styles'

export type SelectProps<Value, Multiply extends boolean>
= SelectPrimitive.Root.Props<Value, Multiply> & Partial<SelectContextState>

export const Select = <Value, Multiply extends boolean>(props: SelectProps<Value, Multiply>) => {
  const { size, position, ...rootProps } = props

  return (
    <SelectProvider size={size} position={position}>
      <SelectPrimitive.Root data-slot="select" {...rootProps} />
    </SelectProvider>
  )
}

export type SelectGroupProps = SelectPrimitive.Group.Props

export const SelectGroup = (props: SelectGroupProps) => {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

export type SelectValueProps = SelectPrimitive.Value.Props

export const SelectValue = (props: SelectValueProps) => {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

export type SelectTriggerProps = SelectPrimitive.Trigger.Props & {
  size?: 'sm' | 'default'
  leftIcon?: React.ReactNode
  hideChevron?: boolean
  hideSelectedValue?: boolean
  label?: string
}

export const SelectTrigger = (props: SelectTriggerProps) => {
  const {
    className,
    children,
    leftIcon,
    label,
    hideChevron = false,
    hideSelectedValue = false,
    ...triggerProps
  } = props

  const { size } = useSelectContext()

  const style = React.useMemo(() => {
    return cn(selectTriggerVariants({ size }), className)
  }, [size, className])

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={style}
      {...triggerProps}
    >
      {leftIcon}
      {!label && !hideSelectedValue && <SelectPrimitive.Value />}
      {label}
      {!hideChevron && (
        <SelectPrimitive.Icon>
          <ChevronDownIcon className="size-4 opacity-50" />
        </SelectPrimitive.Icon>
      )}
    </SelectPrimitive.Trigger>
  )
}

export type SelectContentProps = SelectPrimitive.Positioner.Props & {
  portalProps?: SelectPrimitive.Portal.Props
  popupProps?: SelectPrimitive.Popup.Props
}

export const SelectContent = (props: SelectContentProps) => {
  const {
    className,
    children,
    popupProps,
    portalProps,
    ...positionerProps
  } = props

  return (
    <SelectPrimitive.Portal {...portalProps}>
      <SelectPrimitive.Positioner className={cn(selectPositionerVariants())} sideOffset={12} {...positionerProps}>
        <SelectPrimitive.Popup className={cn(selectPopupVariants(), className)} {...popupProps}>
          <SelectPrimitive.ScrollUpArrow />
          {children}
          <SelectPrimitive.ScrollDownArrow />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

export type SelectListProps = SelectPrimitive.List.Props

export const SelectList = (props: SelectListProps) => {
  const { className, ...restProps } = props

  return <SelectPrimitive.List className={cn(selectListVariants(), className)} {...restProps} />
}

export type SelectItemProps = SelectPrimitive.Item.Props & {
  itemWrapperProps?: SelectPrimitive.ItemText.Props
}

export const SelectItem = (props: SelectItemProps) => {
  const {
    className,
    itemWrapperProps,
    label,
    children,
    ...restProps
  } = props

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(selectItemVariants(), className)}
      {...restProps}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText {...itemWrapperProps}>
        {label}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

export type SelectSeparatorProps = SelectPrimitive.Separator.Props

export const SelectSeparator = (props: SelectSeparatorProps) => {
  const { className, ...restProps } = props

  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(selectSeparatorVariants(), className)}
      {...restProps}
    />
  )
}

export type SelectScrollUpButtonProps = SelectPrimitive.ScrollUpArrow.Props

export const SelectScrollUpButton = (props: SelectScrollUpButtonProps) => {
  const { className, ...restProps } = props

  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(selectScrollUpButtonVariants(), className)}
      {...restProps}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpArrow>
  )
}

export type SelectScrollDownArrowProps = SelectPrimitive.ScrollDownArrow.Props

export const SelectScrollDownButton = (props: SelectScrollDownArrowProps) => {
  const { className, ...restProps } = props

  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(selectScrollDownButtonVariants(), className)}
      {...restProps}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownArrow>
  )
}
