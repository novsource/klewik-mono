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

function Drawer({
  ...props
}: ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({
  ...props
}: ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({
  ...props
}: ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({
  ...props
}: ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay(props: ComponentProps<typeof DrawerPrimitive.Overlay>) {
  const { className, ...restProps } = props

  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(drawerOverlayVariants(), className)}
      {...restProps}
    />
  )
}

function DrawerContent(props: ComponentProps<typeof DrawerPrimitive.Content>
  & DrawerContentVariantsProps & { hidePill?: boolean }) {
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

function DrawerHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(drawerHeaderVariants(), className)}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(drawerFooterVariants(), className)}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(drawerTitleVariants(), className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn(drawerDescriptionVariants(), className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
}
