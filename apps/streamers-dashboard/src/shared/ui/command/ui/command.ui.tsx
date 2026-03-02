import type { ComponentProps, ReactNode } from 'react'

import { Command as CommandPrimitive } from 'cmdk'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~shared/ui/dialog'
import { Icons } from '~shared/ui/icons'

import { cn } from '~shared/utils'

import {
  commandGroupVariants,
  commandInputVariants,
  commandItemVariants,
  commandListVariants,
  commandShortcutVariants,
  commandVariants,
} from '../styles/command-variants'

export type CommandProps = ComponentProps<typeof CommandPrimitive>

export const Command = (props: CommandProps) => {
  const { className, ...restProps } = props

  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(commandVariants(), className)}
      {...restProps}
    />
  )
}

export type CommandDialogProps = ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
  children: ReactNode
}

export const CommandDialog = (props: CommandDialogProps) => {
  const {
    title = 'Command Palette',
    description = 'Search for a command to run...',
    children,
    ...restProps
  } = props

  return (
    <Dialog {...restProps}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

export type CommandInputProps = ComponentProps<typeof CommandPrimitive.Input>

export const CommandInput = (props: CommandInputProps) => {
  const { className, ...restProps } = props

  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b px-3"
    >
      <Icons.Magnifier size="xs" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(commandInputVariants(), className)}
        {...restProps}
      />
    </div>
  )
}

export type CommandListProps = ComponentProps<typeof CommandPrimitive.List>

export const CommandList = (props: CommandListProps) => {
  const { className, ...restProps } = props

  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(commandListVariants(), className)}
      {...restProps}
    />
  )
}

export type CommandEmptyProps = ComponentProps<typeof CommandPrimitive.Empty>

export const CommandEmpty = (props: CommandEmptyProps) => {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  )
}

export type CommandGroupProps = ComponentProps<typeof CommandPrimitive.Group>

export const CommandGroup = (props: CommandGroupProps) => {
  const { className, ...restProps } = props

  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(commandGroupVariants(), className)}
      {...restProps}
    />
  )
}

export type CommandSeparatorProps = ComponentProps<typeof CommandPrimitive.Separator>

export const CommandSeparator = (props: CommandSeparatorProps) => {
  const { className, ...restProps } = props

  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn('bg-border -mx-1 h-px', className)}
      {...restProps}
    />
  )
}

export type CommandItemProps = ComponentProps<typeof CommandPrimitive.Item>

export const CommandItem = (props: CommandItemProps) => {
  const { className, ...restProps } = props

  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(commandItemVariants(), className)}
      {...restProps}
    />
  )
}

export type CommandShortcutProps = ComponentProps<'span'>

export const CommandShortcut = (props: CommandShortcutProps) => {
  const { className, ...restProps } = props

  return (
    <span
      data-slot="command-shortcut"
      className={cn(commandShortcutVariants(), className)}
      {...restProps}
    />
  )
}
