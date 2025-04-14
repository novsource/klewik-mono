import * as React from 'react'

import * as SelectPrimitive from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

import { cn } from '~shared/utils'

import {
  SelectContextState,
  SelectProvider,
  useSelectContext,
} from '../context'
import {
  selectContentVariants,
  selectItemVariants,
  selectLabelVariants,
  selectScrollDownButtonVariants,
  selectScrollUpButtonVariants,
  selectSeparatorVariants,
  selectTriggerVariants,
  selectViewportVariants,
} from '../styles'

function Select({
  size,
  position,
  ...rootProps
}: React.ComponentProps<typeof SelectPrimitive.Root> &
  Partial<SelectContextState>) {
  return (
    <SelectProvider size={size} position={position}>
      <SelectPrimitive.Root data-slot="select" {...rootProps} />
    </SelectProvider>
  )
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size: propSize = 'default',
  children,
  ...triggerProps
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default'
}) {
  const { size } = useSelectContext()

  const style = React.useMemo(() => {
    return cn(selectTriggerVariants({ size: propSize ?? size }), className)
  }, [propSize, size])

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={propSize ?? size}
      className={style}
      {...triggerProps}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position: propPosition = 'popper',
  ...contentProps
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const { position } = useSelectContext()

  const style = React.useMemo(() => {
    return cn(selectContentVariants({ position }), className)
  }, [propPosition, position])

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={style}
        position={propPosition ?? position}
        {...contentProps}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className={cn(selectViewportVariants())}>
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(selectLabelVariants(), className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(selectItemVariants(), className)}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(selectSeparatorVariants(), className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(selectScrollUpButtonVariants(), className)}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(selectScrollDownButtonVariants(), className)}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
