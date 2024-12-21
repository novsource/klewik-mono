import { cva } from 'class-variance-authority'

export const baseSonnerVariants = cva('toaster group')

export const toastSonnerVariants = cva(
  'group toast group-[.toaster]:bg-[#222224] group-[.toaster]:text-white group-[.toaster]:border-1 group-[.toaster]:border-gray/70 group-[.toaster]:shadow-lg group-[.toaster]:rounded-large group-[.toaster]:text-lg'
)

export const descriptionSonnerVariants = cva('group-[.toast]:text-gray')

export const actionButtonSonnerVariants = cva(
  'group-[.toast]:bg-primary group-[.toast]:text-white group-[.toast]:rounded-pill'
)

export const cancelButtonSonnerVariants = cva(
  'group-[.toast]:bg-dark group-[.toast]:text-dark'
)
