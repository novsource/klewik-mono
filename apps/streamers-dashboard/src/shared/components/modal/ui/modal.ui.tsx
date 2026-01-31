import { useMemo } from 'react'

import type { TitleProps } from '~shared/components/typography'
import { Title } from '~shared/components/typography'

import type { DialogCloseProps, DialogContentProps, DialogFooterProps, DialogHeaderProps, DialogProps, DialogTriggerProps } from '~shared/ui/dialog'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '~shared/ui/dialog'
import { Icons } from '~shared/ui/icons'

import { cn } from '~shared/utils'

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

export type ModalContentProps = DialogContentProps

export const ModalContent = (props: ModalContentProps) => {
  const { className, children, ...restProps } = props

  const classes = useMemo(() => cn([
    'p-0 w-full h-full max-w-[700px] max-h-3/5 min-h-[300px]',
    'landtop:min-w-[700px] landtop:w-1/2 landtop:max-w-[900px]',
    'desktop:min-w-[900px] desktop:w-1/2 desktop:max-w-[1100px]',
    'desktop-lg:min-w-[1100px] desktop-lg:w-1/2 desktop-lg:max-w-[1300px]',
    'flex flex-col gap-y-0 justify-between',
    'border-dark-light rounded-[16px] bg-dark-foreground overflow-scroll',
  ], className), [className])

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
