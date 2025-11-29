import type { SelectContextState } from '../context'

import * as React from 'react'

import * as SelectPrimitive from '@base-ui-components/react/select'
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
= SelectPrimitive.SelectRoot.Props<Value, Multiply> & Partial<SelectContextState>

export const Select = <Value, Multiply extends boolean>(props: SelectProps<Value, Multiply>) => {
  const { size, position, ...rootProps } = props

  return (
    <SelectProvider size={size} position={position}>
      <SelectPrimitive.Select.Root data-slot="select" {...rootProps} />
    </SelectProvider>
  )
}

export type SelectGroupProps = SelectPrimitive.SelectGroup.Props

export const SelectGroup = (props: SelectGroupProps) => {
  return <SelectPrimitive.Select.Group data-slot="select-group" {...props} />
}

export type SelectValueProps = SelectPrimitive.SelectValue.Props

export const SelectValue = (props: SelectValueProps) => {
  return <SelectPrimitive.Select.Value data-slot="select-value" {...props} />
}

export type SelectTriggerProps = SelectPrimitive.SelectTrigger.Props & {
  size?: 'sm' | 'default'
  label?: string
}

export const SelectTrigger = (props: SelectTriggerProps) => {
  const {
    className,
    children,
    label,
    ...triggerProps
  } = props

  const { size } = useSelectContext()

  const style = React.useMemo(() => {
    return cn(selectTriggerVariants({ size }), className)
  }, [size, className])

  return (
    <SelectPrimitive.Select.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={style}
      {...triggerProps}
    >
      {!label && <SelectPrimitive.Select.Value />}
      {label}
      <SelectPrimitive.Select.Icon>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Select.Icon>
    </SelectPrimitive.Select.Trigger>
  )
}

export type SelectContentProps = SelectPrimitive.SelectPositioner.Props & {
  portalProps?: SelectPrimitive.SelectPortal.Props
  popupProps?: SelectPrimitive.SelectPopup.Props
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
    <SelectPrimitive.Select.Portal {...portalProps}>
      <SelectPrimitive.Select.Positioner className={cn(selectPositionerVariants())} sideOffset={12} {...positionerProps}>
        <SelectPrimitive.Select.Popup className={cn(selectPopupVariants(), className)} {...popupProps}>
          <SelectPrimitive.Select.ScrollUpArrow />
          {children}
          <SelectPrimitive.Select.ScrollDownArrow />
        </SelectPrimitive.Select.Popup>
      </SelectPrimitive.Select.Positioner>
    </SelectPrimitive.Select.Portal>
  )
}

export type SelectListProps = SelectPrimitive.SelectList.Props

export const SelectList = (props: SelectListProps) => {
  const { className, ...restProps } = props

  return <SelectPrimitive.Select.List className={cn(selectListVariants(), className)} {...restProps} />
}

export type SelectItemProps = SelectPrimitive.SelectItem.Props & {
  itemWrapperProps?: SelectPrimitive.SelectItemText.Props
}

export const SelectItem = (props: SelectItemProps) => {
  const {
    className,
    itemWrapperProps,
    children,
    ...restProps
  } = props

  return (
    <SelectPrimitive.Select.Item
      data-slot="select-item"
      className={cn(selectItemVariants(), className)}
      {...restProps}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.Select.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.Select.ItemIndicator>
      </span>
      <SelectPrimitive.Select.ItemText {...itemWrapperProps}>
        {children}
      </SelectPrimitive.Select.ItemText>
    </SelectPrimitive.Select.Item>
  )
}

export type SelectSeparatorProps = SelectPrimitive.Select.Separator.Props

export const SelectSeparator = (props: SelectSeparatorProps) => {
  const { className, ...restProps } = props

  return (
    <SelectPrimitive.Select.Separator
      data-slot="select-separator"
      className={cn(selectSeparatorVariants(), className)}
      {...restProps}
    />
  )
}

export type SelectScrollUpButtonProps = SelectPrimitive.SelectScrollUpArrow.Props

export const SelectScrollUpButton = (props: SelectScrollUpButtonProps) => {
  const { className, ...restProps } = props

  return (
    <SelectPrimitive.Select.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(selectScrollUpButtonVariants(), className)}
      {...restProps}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.Select.ScrollUpArrow>
  )
}

export type SelectScrollDownArrowProps = SelectPrimitive.SelectScrollDownArrow.Props

export const SelectScrollDownButton = (props: SelectScrollDownArrowProps) => {
  const { className, ...restProps } = props

  return (
    <SelectPrimitive.Select.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(selectScrollDownButtonVariants(), className)}
      {...restProps}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.Select.ScrollDownArrow>
  )
}
