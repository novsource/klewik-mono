import { cva } from 'class-variance-authority'

export const baseSonnerVariants = cva('toaster group')

export const toastSonnerVariants = cva(
  'group toast group-[.toaster]:bg-dar group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg'
)

export const descriptionSonnerVariants = cva(
  'group-[.toast]:text-muted-foreground'
)

export const actionButtonSonnerVariants = cva(
  'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground'
)

export const cancelButtonSonnerVariants = cva(
  'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground'
)
