import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

const radioVariants = cva('flex items-center justify-center rounded-full outline-none', {
  variants: {
    variant: {
      default: [
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800',
        'data-[checked]:bg-green-dark data-[unchecked]:border-1 data-[unchecked]:border-dark-accent',
      ],
      ghost: 'hidden',
    },
    size: {
      lg: 'size-5',
      default: 'size-4.5',
      sm: 'size-4',
    },
  },
  defaultVariants: {
    variant: 'ghost',
    size: 'default',
  },
})

const radioIndicatorVariants = cva('', {
  variants: {
    variant: {
      default: 'flex before:size-1.5 before:rounded-full before:bg-green-accent/60 data-[unchecked]:hidden',
      ghost: '',
    },
    size: {
      lg: 'before:size-2.5',
      default: 'size-2',
      sm: 'before:size-1.5',
    },
  },
  defaultVariants: {
    variant: 'ghost',
    size: 'default',
  },
})

const radioLabelVariants = cva('flex items-center font-breeze text-sm cursor-pointer transition-all', {
  variants: {
    variant: {
      default: 'text-gray-light has-[:checked]:text-gray-accent',
      ghost: [
        'bg-dark rounded-small border-1 border-dark-light text-gray',
        'has-[:checked]:bg-green-dark has-[:checked]:border-green-accent/60 has-[:checked]:text-green-accent/80',
      ],
    },
    size: {
      lg: 'p-2.75 gap-2.25',
      default: 'p-2.25 gap-2',
      sm: 'p-1.75 gap-1.5',
    },
  },
  defaultVariants: {
    variant: 'ghost',
    size: 'default',
  },
})

export { radioIndicatorVariants, radioLabelVariants, radioVariants }
export type RadioVariantsProps = VariantProps<typeof radioVariants>
export type RadioIndicatorVariantsProps = VariantProps<typeof radioIndicatorVariants>
export type RadioLabelVariantsProps = VariantProps<typeof radioLabelVariants>
