import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

const dialogBackdropVariants = cva([
  'fixed inset-0 z-50 bg-dark/80',
], {
  variants: { disableAnimation: {
    true: '',
    false: 'data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0',
  } },
  defaultVariants: {
    disableAnimation: false,
  },
})

const dialogContentVariants = cva([
  'bg-dark z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg',
  'fixed translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]',
], {
  variants: {
    disableAnimation: {
      true: '',
      false: ['duration-200', 'data-[closed]:zoom-out-95 data-[open]:zoom-in-95', 'data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0'],
    },
  },
  defaultVariants: {
    disableAnimation: false,
  },
})

const dialogHeaderVariants = cva('flex flex-col gap-2 text-center sm:text-left')

const dialogTitleVariants = cva(
  'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
)

type DialogBackdropVariantsProps = VariantProps<typeof dialogBackdropVariants>
type DialogContentVariantsProps = VariantProps<typeof dialogContentVariants>
type DialogHeaderVariantsProps = VariantProps<typeof dialogHeaderVariants>
type DialogTitleVariantsProps = VariantProps<typeof dialogTitleVariants>

export type {
  DialogBackdropVariantsProps,
  DialogContentVariantsProps,
  DialogHeaderVariantsProps,
  DialogTitleVariantsProps,
}
export {
  dialogContentVariants,
  dialogHeaderVariants,
  dialogBackdropVariants as dialogOverlayVariants,
  dialogTitleVariants,
}
