import type { SheetVariantsProps } from '../styles'

import { forwardRef, useMemo } from 'react'

import type {
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogHeaderProps,
  DialogProps,
  DialogTitleProps,
  DialogTriggerProps,
} from 'klewik-ui/dialog'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from 'klewik-ui/dialog'

import { cn } from '~shared/utils'

import { sheetBackdropVariants, sheetCloseButtonVariants, sheetDescriptionVariants, sheetHeaderVariants, sheetTitleVariants, sheetVariants } from '../styles'

export type SheetProps = DialogProps

export const Sheet = (props: SheetProps) => {
  return <Dialog {...props} />
}

export type SheetTriggerProps = DialogTriggerProps

export const SheetTrigger = (props: SheetTriggerProps) => {
  return <DialogTrigger {...props} />
}

export type SheetHeaderProps = DialogHeaderProps

export const SheetHeader = (props: SheetHeaderProps) => {
  const { className, ...restProps } = props

  const styles = useMemo(() => cn(sheetHeaderVariants(), className), [className])

  return <DialogHeader className={styles} {...restProps} />
}

export type SheetContentProps = DialogContentProps & SheetVariantsProps

export const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>((props, forwardRef) => {
  const { side, isFullPageSize, backdropProps, className, ...restProps } = props

  const styles = useMemo(() => {
    return {
      backdrop: cn(sheetBackdropVariants(), backdropProps?.className),
      content: cn(sheetVariants({ side, isFullPageSize }), typeof className === 'function' ? '' : className),
    }
  }, [side, className, isFullPageSize, backdropProps?.className])

  return (
    <DialogContent
      ref={forwardRef}
      className={styles.content}
      backdropProps={{ ...backdropProps, className: styles.backdrop }}
      disableAnimation
      {...restProps}
    />
  )
})

export type SheetTitleProps = DialogTitleProps

export const SheetTitle = (props: SheetTitleProps) => {
  const { className, ...restProps } = props

  const style = useMemo(() => cn(sheetTitleVariants(), className), [className])

  return <DialogTitle className={style} {...restProps} />
}

export type SheetDescriptionProps = DialogDescriptionProps

export const SheetDescription = (props: SheetDescriptionProps) => {
  const { className, ...restProps } = props

  const style = useMemo(() => cn(sheetDescriptionVariants(), className), [className])

  return <DialogDescription className={style} {...restProps} />
}

export type SheetCloseProps = DialogCloseProps

export const SheetClose = (props: SheetCloseProps) => {
  const { className, ...restProps } = props

  const style = useMemo(() => cn(sheetCloseButtonVariants(), className), [className])

  return <DialogClose className={style} {...restProps} />
}
