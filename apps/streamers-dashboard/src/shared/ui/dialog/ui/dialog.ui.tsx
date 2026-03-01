import type { DialogBackdropVariantsProps, DialogContentVariantsProps, DialogTitleVariantsProps } from '../styles'

import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef, useMemo } from 'react'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { cn } from '~shared/utils'

import { dialogContentVariants, dialogFooterVariants, dialogHeaderVariants, dialogOverlayVariants, dialogTitleVariants } from '../styles'

export type DialogProps = DialogPrimitive.Root.Props

export const Dialog = (props: DialogProps) => {
  return <DialogPrimitive.Root data-slot="dialog-base" {...props} />
}

export type DialogHeaderProps = ComponentPropsWithoutRef<'div'>

export const DialogHeader = (props: DialogHeaderProps) => {
  const { className, ...restProps } = props

  const styles = useMemo(() => cn(dialogHeaderVariants(), className), [className])

  return <div className={styles} {...restProps} />
}

export type DialogTriggerProps = DialogPrimitive.Trigger.Props

export const DialogTrigger = forwardRef<ElementRef<typeof DialogPrimitive.Trigger>, DialogTriggerProps>(
  (props, ref) => {
    const { className, ...restProps } = props

    return <DialogPrimitive.Trigger ref={ref} className={cn(className)} data-slot="dialog-trigger" {...restProps} />
  },
)

export type DialogContentProps = DialogPrimitive.Popup.Props & DialogContentVariantsProps & {
  portalProps?: DialogPrimitive.Portal.Props
  backdropProps?: DialogPrimitive.Backdrop.Props & DialogBackdropVariantsProps
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>((props, forwardRef) => {
  const { portalProps, backdropProps, className, disableAnimation, ...popupProps } = props

  const styles = useMemo(() => {
    return {
      backdrop: cn(dialogOverlayVariants({ disableAnimation: backdropProps?.disableAnimation }), backdropProps?.className),
      content: cn(dialogContentVariants({ disableAnimation }), className),
    } as const
  }, [className, backdropProps?.className, disableAnimation, backdropProps?.disableAnimation])

  return (
    <DialogPrimitive.Portal data-slot="dialog-portal" {...portalProps}>
      <DialogPrimitive.Backdrop className={styles.backdrop} data-slot="dialog-backdrop" {...backdropProps} />
      <DialogPrimitive.Popup ref={forwardRef} className={styles.content} data-slot="dialog-content" {...popupProps} />
    </DialogPrimitive.Portal>
  )
})

export type DialogTitleProps = DialogPrimitive.Title.Props & DialogTitleVariantsProps

export const DialogTitle = (props: DialogTitleProps) => {
  const { className, ...restProps } = props

  const style = useMemo(() => cn(dialogTitleVariants(), className), [className])

  return <DialogPrimitive.Title className={style} data-slot="dialog-title" {...restProps} />
}

export type DialogDescriptionProps = DialogPrimitive.Description.Props

export const DialogDescription = (props: DialogDescriptionProps) => {
  const { className, ...restProps } = props

  return <DialogPrimitive.Description className={cn(className)} data-slot="dialog-description" {...restProps} />
}

export type DialogCloseProps = DialogPrimitive.Close.Props

export const DialogClose = (props: DialogCloseProps) => {
  const { className, ...restProps } = props
  return <DialogPrimitive.Close className={cn(className)} data-slot="dialog-close" {...restProps} />
}

export type DialogFooterProps = ComponentPropsWithoutRef<'div'>

export const DialogFooter = (props: DialogFooterProps) => {
  const { className, ...restProps } = props

  const style = useMemo(() => cn(dialogFooterVariants(), className), [className])

  return <div className={style} {...restProps} />
}
