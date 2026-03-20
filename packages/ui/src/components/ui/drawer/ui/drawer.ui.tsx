'use client'

import type { DrawerSide, DrawerSize } from '../styles/drawer.variants'

import { useMemo } from 'react'

import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'

import { cn } from '~utils/cn'

import { DrawerContextProvider, useDrawerContext } from '../context/drawer.context'
import { drawerBackdropVariants, drawerContentVariants, drawerPopupVariants, drawerViewportVariants } from '../styles/drawer.variants'

export type DrawerProps = DrawerPrimitive.Root.Props & {
  side?: DrawerSide
  size?: DrawerSize
}

export const Drawer = (props: DrawerProps) => {
  const { side = 'right', size = 'default', ...restProps } = props

  const contextValue = useMemo<ReturnType<typeof useDrawerContext>>(() => ({
    styles: {
      side,
      size,
    },
  }), [side, size])

  return (
    <DrawerContextProvider value={contextValue}>
      <DrawerPrimitive.Root {...restProps} />
    </DrawerContextProvider>
  )
}

export type DrawerTriggerProps = DrawerPrimitive.Trigger.Props

export const DrawerTrigger = (props: DrawerTriggerProps) => {
  return <DrawerPrimitive.Trigger {...props} />
}

export const DrawerTitle = (props: DrawerPrimitive.Title.Props) => {
  return <DrawerPrimitive.Title {...props} />
}

export const DrawerDescription = (props: DrawerPrimitive.Description.Props) => {
  return <DrawerPrimitive.Description {...props} />
}

export const DrawerClose = (props: DrawerPrimitive.Close.Props) => {
  return <DrawerPrimitive.Close {...props} />
}

export type DrawerContentProps = ExtractComponentClassnameToSlot<DrawerPrimitive.Content.Props, 'content'>
  & ExtractComponentClassnameToSlot<DrawerPrimitive.Backdrop.Props, 'backdrop', 'backdropProps'>
  & ExtractComponentClassnameToSlot<DrawerPrimitive.Viewport.Props, 'viewport', 'viewportProps'>
  & ExtractComponentClassnameToSlot<DrawerPrimitive.Popup.Props, 'popup', 'popupProps'>
  & {
    portalProps?: DrawerPrimitive.Portal.Props
    showPill?: boolean
  }

export const DrawerContent = (props: DrawerContentProps) => {
  const {
    slotClassnames,
    children,
    popupProps,
    portalProps,
    viewportProps,
    backdropProps,
    showPill = true,
    ...contentProps
  } = props

  const drawerContext = useDrawerContext()

  const classes = useMemo<NonNullable<typeof slotClassnames>>(() => ({
    content: cn(drawerContentVariants({ ...drawerContext.styles, className: slotClassnames?.content })),
    backdrop: cn(drawerBackdropVariants({ ...drawerContext.styles, className: slotClassnames?.backdrop })),
    popup: cn(drawerPopupVariants({ ...drawerContext.styles, className: slotClassnames?.popup })),
    viewport: cn(drawerViewportVariants({ ...drawerContext.styles, className: slotClassnames?.viewport })),
  }), [slotClassnames, drawerContext.styles])

  return (
    <DrawerPrimitive.Portal {...portalProps}>
      <DrawerPrimitive.Backdrop className={classes.backdrop} {...backdropProps} />
      <DrawerPrimitive.Viewport className={classes.viewport} {...viewportProps}>
        <DrawerPrimitive.Popup className={classes.popup} {...popupProps}>
          {showPill && drawerContext.styles.side === 'bottom' && <div className="mx-auto mb-3 h-1 w-12 shrink-0 rounded-full bg-gray pointer-events-none" />}
          <DrawerPrimitive.Content className={classes.content} {...contentProps}>
            {children}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPrimitive.Portal>
  )
}
