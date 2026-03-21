import { cva } from 'class-variance-authority'

export const checkboxRootVariants = cva([
  'flex size-5 items-center justify-center rounded-xs',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green',
  'data-[checked]:bg-green-dark data-[checked]:border-green data-[unchecked]:border data-[unchecked]:border-dark-accent',
])

export const checkboxIndicatorVariants = cva([
  'flex text-gray-50 data-[checked]:text-green-accent data-[unchecked]:hidden',
])
