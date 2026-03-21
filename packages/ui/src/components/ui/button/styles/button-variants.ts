import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'
import { ClassValue } from 'class-variance-authority/types'


type ButtonVariant
  = | 'default'
  | 'action'
  | 'error'
  | 'ghost'
  | 'borderless'

type ButtonSize = 'sm' | 'default' | 'lg' | 'xs'

type ButtonVariants = {
  variant: {
    [Variant in ButtonVariant]: ClassValue
  }
  size: {
    [Size in ButtonSize]: ClassValue
  }
  isIconOnly: {
    [Bool in 'true' | 'false']: ClassValue
  }
  startContent: {
    [Bool in 'true' | 'false']: ClassValue
  }
  endContent: {
    [Bool in 'true' | 'false']: ClassValue
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
        error: 'border-1 border-red/20 bg-red/5 text-red hover:bg-red/15 hover:border-red/30',
        ghost: 'border-transparent bg-transparent',
        borderless: 'border-transparent bg-dark text-gray-accent hover:border-gray/40 hover:bg-dark-accent/40 hover:text-white active:bg-dark/80',
      },
      isIconOnly: {
        true: '',
        false: '',
      },
      size: {
        xs: 'font-regular h-7 rounded-md px-2 py-1.5 text-sm leading-4 data-[icon-only=false]:[&_svg]:size-4',
        sm: 'h-8 rounded-md px-2.5 py-1.75 text-sm leading-4.5 font-medium data-[icon-only=false]:[&_svg]:size-4',
        default:
          'h-9.5 rounded-md px-3.25 py-2 px-3 text-md leading-4.5 font-medium data-[icon-only=false]:[&_svg]:size-4.5',
        lg: 'h-10 text-base rounded-md px-4 py-2.5 font-medium data-[icon-only=false]:[&_svg]:size-4.5',
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
      { isIconOnly: true, size: 'default', className: 'size-9 [&_svg]:size-4.5' },
      { isIconOnly: true, size: 'sm', className: 'size-8 [&_svg]:size-3.75' },
      { isIconOnly: true, size: 'xs', className: 'size-7 [&_svg]:size-4' },
    ],
  },
)

export type ButtonVariantsProps = VariantProps<typeof buttonVariants>
