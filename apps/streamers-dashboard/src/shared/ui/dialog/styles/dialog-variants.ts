import { VariantProps, cva } from 'class-variance-authority'

const dialogOverlayVariants = cva([
  'fixed inset-0 z-50 bg-dark/80',
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
])

const dialogContentVariants = cva([
  'bg-dark z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
  'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 ',
  'fixed translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]',
])

const dialogHeaderVariants = cva('flex flex-col gap-2 text-center sm:text-left')

const dialogTitleVariants = cva(
  'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'
)

type DialogOverlayVariantsProps = VariantProps<typeof dialogOverlayVariants>
type DialogContentVariantsProps = VariantProps<typeof dialogContentVariants>
type DialogHeaderVariantsProps = VariantProps<typeof dialogHeaderVariants>
type DialogTitleVariantsProps = VariantProps<typeof dialogTitleVariants>

export type {
  DialogOverlayVariantsProps,
  DialogContentVariantsProps,
  DialogHeaderVariantsProps,
  DialogTitleVariantsProps,
}
export {
  dialogOverlayVariants,
  dialogContentVariants,
  dialogHeaderVariants,
  dialogTitleVariants,
}
