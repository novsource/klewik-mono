import type {
  DrawerContentVariantsProps,
} from '../styles/drawer-variants'

import type { ComponentProps } from 'react'

import { Drawer as DrawerPrimitive } from 'vaul'

import { cn } from '~shared/utils'

import {
  drawerContentVariants,
  drawerDescriptionVariants,
  drawerFooterVariants,
  drawerHeaderVariants,
  drawerOverlayVariants,
  drawerPillVariants,
  drawerTitleVariants,
} from '../styles/drawer-variants'

export type DrawerProps = ComponentProps<typeof DrawerPrimitive.Root>

export function Drawer(props: DrawerProps) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

export type DrawerTriggerProps = ComponentProps<typeof DrawerPrimitive.Trigger>

export function DrawerTrigger(props: DrawerTriggerProps) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

export type DrawerPortalProps = ComponentProps<typeof DrawerPrimitive.Portal>

function DrawerPortal(props: DrawerPortalProps) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

export type DrawerCloseProps = ComponentProps<typeof DrawerPrimitive.Close>

export function DrawerClose(props: DrawerCloseProps) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

export type DrawerOverlayProps = ComponentProps<typeof DrawerPrimitive.Overlay>

function DrawerOverlay(props: DrawerOverlayProps) {
  const { className, ...restProps } = props

  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(drawerOverlayVariants(), className)}
      {...restProps}
    />
  )
}

export type DrawerContentProps = ComponentProps<typeof DrawerPrimitive.Content>
  & DrawerContentVariantsProps & { hidePill?: boolean }

export function DrawerContent(props: DrawerContentProps) {
  const { className, children, isFullPageHeight, hidePill = false, ...restProps } = props

  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(drawerContentVariants({ isFullPageHeight }), className)}
        {...restProps}
      >
        {!hidePill && <div className={drawerPillVariants()} />}
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

export type DrawerHeaderProps = ComponentProps<'div'>

export function DrawerHeader(props: DrawerHeaderProps) {
  const { className, ...restProps } = props

  return (
    <div
      data-slot="drawer-header"
      className={cn(drawerHeaderVariants(), className)}
      {...restProps}
    />
  )
}

export type DrawerFooterProps = ComponentProps<'div'>

export function DrawerFooter(props: DrawerFooterProps) {
  const { className, ...restProps } = props

  return (
    <div
      data-slot="drawer-footer"
      className={cn(drawerFooterVariants(), className)}
      {...restProps}
    />
  )
}

export type DrawerTitleProps = ComponentProps<typeof DrawerPrimitive.Title>

export function DrawerTitle(props: DrawerTitleProps) {
  const { className, ...restProps } = props

  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(drawerTitleVariants(), className)}
      {...restProps}
    />
  )
}

export type DrawerDescriptionProps = ComponentProps<typeof DrawerPrimitive.Description>

export function DrawerDescription(props: DrawerDescriptionProps) {
  const { className, ...restProps } = props
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn(drawerDescriptionVariants(), className)}
      {...restProps}
    />
  )
}
