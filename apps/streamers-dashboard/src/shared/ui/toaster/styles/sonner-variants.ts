import { cva } from 'class-variance-authority'

export const baseSonnerVariants = cva('toaster group')

export const toastSonnerVariants = cva(
  'z-[99999] group toast group-[.toaster]:bg-dark-foreground w-full group-[.toaster]:text-white group-[.toaster]:border-1 group-[.toaster]:border-gray/70 group-[.toaster]:shadow-lg group-[.toaster]:rounded-large group-[.toaster]:text-lg px-4 py-3 pointer-events-auto',
)

export const contentToastSonnerVariants = cva('gap-y-4')

export const titleToastSonnerVariants = cva('text-sm font-bold font-golos-f')

export const descriptionSonnerVariants = cva('group-[.toast]:text-gray')

export const actionButtonSonnerVariants = cva(
  'group-[.toast]:bg-primary group-[.toast]:text-white group-[.toast]:rounded-pill',
)

export const cancelButtonSonnerVariants = cva(
  'group-[.toast]:bg-dark group-[.toast]:text-dark',
)
