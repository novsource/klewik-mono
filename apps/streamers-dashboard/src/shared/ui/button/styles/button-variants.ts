import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import type { CvaClassValue } from '~shared/utils/types'

type ButtonVariant
  = | 'default'
    | 'action'
    | 'error'
    | 'ghost'

type ButtonSize = 'sm' | 'default' | 'lg' | 'xs'

type ButtonVariants = {
  variant: {
    [Variant in ButtonVariant]: CvaClassValue
  }
  size: {
    [Size in ButtonSize]: CvaClassValue
  }
  isIconOnly: {
    [Bool in 'true' | 'false']: CvaClassValue
  }
  startContent: {
    [Bool in 'true' | 'false']: CvaClassValue
  }
  endContent: {
    [Bool in 'true' | 'false']: CvaClassValue
  }
}

export const buttonVariants = cva<ButtonVariants>(
  [
    'inline-flex items-center justify-center gap-2 touch-manipulation active:scale-[98%]',
    'ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    'cursor-pointer rounded-small whitespace-nowrap transition-all select-none',
  ],
  {
    variants: {
      variant: {
        default:
          'border-1 border-gray/20 bg-dark text-gray-accent hover:border-gray/40 hover:bg-dark-accent/40 hover:text-white active:bg-dark/80',
        action:
          'bg-green-dark text-green-accent/80 hover:bg-green/10 hover:text-green-accent',
        error: 'border-1 border-red/20 bg-red/10 text-red hover:bg-red/15 hover:border-red/30',
        ghost: 'border-transparent bg-transparent',
      },
      isIconOnly: {
        true: '',
        false: '',
      },
      size: {
        default:
          'h-9.5 rounded-md px-3.25 py-1.25 text-md leading-6 font-medium data-[icon-only=false]:[&_svg]:size-4.25',
        xs: 'font-regular h-8.5 rounded-md px-1.5 text-sm leading-5 data-[icon-only=false]:[&_svg]:size-3.5',
        sm: 'h-9 rounded-md px-2.5 py-0.5 text-sm leading-6 font-medium data-[icon-only=false]:[&_svg]:size-4',
        lg: 'h-10.5 text-base rounded-md px-3 font-medium data-[icon-only=false]:[&_svg]:size-4.5',
      },
      startContent: {
        true: 'flex items-center justify-center gap-x-1.25',
        false: '',
      },
      endContent: {
        true: 'flex items-center justify-center gap-x-1.25',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      isIconOnly: false,
    },
    compoundVariants: [
      { isIconOnly: true, size: 'default', className: 'size-10' },
      { isIconOnly: true, size: 'sm', className: 'size-9' },
      { isIconOnly: true, size: 'xs', className: 'size-8' },
    ],
  },
)

export type ButtonVariantsProps = VariantProps<typeof buttonVariants>
