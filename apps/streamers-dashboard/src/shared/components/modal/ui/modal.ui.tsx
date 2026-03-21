import type { DialogCloseProps, DialogContentProps, DialogFooterProps, DialogHeaderProps, DialogProps, DialogTriggerProps } from 'klewik-ui/dialog'

import type { ModalStyleVariants } from '../styles/modal.styles'

import { useMemo } from 'react'

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from 'klewik-ui/dialog'
import { Icons } from 'klewik-ui/icons'

import type { TitleProps } from '~shared/components/typography'
import { Title } from '~shared/components/typography'

import { cn } from '~shared/utils'

import { modalStyles } from '../styles/modal.styles'

export type ModalProps = Omit<DialogProps, 'modal'>

export const Modal = (props: ModalProps) => {
  return (
    <Dialog modal={true} {...props} />
  )
}

export type ModalTriggerProps = DialogTriggerProps

export const ModalTrigger = (props: ModalTriggerProps) => {
  return <DialogTrigger {...props} />
}

export type ModalCloseButtonProps = DialogCloseProps

export const ModalCloseButton = (props: ModalCloseButtonProps) => {
  const { children, className, ...restProps } = props

  const classes = useMemo(() => cn(className), [className])

  return (
    <DialogClose className={classes} {...restProps}>
      {children || <Icons.LargeCross className="text-gray hover:text-gray-accent cursor-pointer" size="lg" />}
    </DialogClose>
  )
}

export type ModalHeaderProps = DialogHeaderProps

export const ModalHeader = (props: ModalHeaderProps) => {
  const { className, ...restProps } = props

  const classes = useMemo(() => cn([
    'h-fit py-3 px-5 text-start flex-row justify-between items-center',
  ], className), [className])

  return <DialogHeader className={classes} {...restProps} />
}

export type ModalHeaderTitleProps = TitleProps

export const ModalHeaderTitle = (props: ModalHeaderTitleProps) => {
  return <Title order={2} {...props} />
}

export type ModalContentProps = DialogContentProps & ModalStyleVariants

export const ModalContent = (props: ModalContentProps) => {
  const { className, children, variant, ...restProps } = props

  const classes = useMemo(() => cn(modalStyles({ variant, className })), [variant, className])

  return (
    <DialogContent className={classes} {...restProps}>
      {children}
    </DialogContent>
  )
}

export type ModalFooterProps = DialogFooterProps

export const ModalFooter = (props: ModalFooterProps) => {
  const { className, ...restProps } = props

  const classes = useMemo(() => cn([
    'h-fit py-3 px-5 border-t-2 border-t-dark-light flex-row gap-x-3 justify-end',
  ], className), [className])

  return <DialogFooter className={classes} {...restProps} />
}
