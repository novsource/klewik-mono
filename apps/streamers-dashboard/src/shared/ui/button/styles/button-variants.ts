import { VariantProps, cva } from 'class-variance-authority'

import { CvaClassValue } from '~shared/utils/types'

type ButtonVariant =
  | 'default'
  | 'action'
  | 'outline'
  | 'error'
  | 'ghost-outline'
  | 'ghost'
  | 'link'

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
    'inline-flex items-center justify-center gap-2',
    'ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:shrink-0 [&_svg]:pointer-events-none',
    'whitespace-nowrap rounded-small transition-all select-none cursor-pointer',
  ],
  {
    variants: {
      variant: {
        default:
          'bg-dark text-gray-accent border-1 border-dark-accent/70 hover:border-gray/55 hover:bg-dark-accent/50 hover:text-white',
        action: 'bg-green text-white hover:bg-green/80',
        error: 'bg-red/10 text-red hover:bg-red/15 border-1 border-red/20',
        outline:
          'bg-dark border-1 border-dark-accent hover:border-gray text-gray-accent hover:bg-dark/80 hover:text-white/80',
        ghost: 'bg-transparent border-transparent',
        'ghost-outline':
          'bg-transparent border-1 border-dark-accent/70 hover:border-gray',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      isIconOnly: {
        true: '',
        false: '',
      },
      size: {
        default:
          'h-9.5 px-2.5 py-1 text-md leading-6 rounded-md font-medium data-[icon-only=false]:[&_svg]:size-4.5',
        sm: 'h-9 rounded-md px-2 text-sm leading-6 font-medium data-[icon-only=false]:[&_svg]:size-4',
        xs: 'h-8.5 rounded-md px-1.5 text-sm leading-5 font-regular data-[icon-only=false]:[&_svg]:size-3.5',
        lg: 'h-10 rounded-md px-3 font-medium data-[icon-only=false]:[&_svg]:size-5',
      },
      startContent: {
        true: 'flex items-center justify-center gap-x-1',
        false: '',
      },
      endContent: {
        true: 'flex items-center justify-center gap-x-1',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      isIconOnly: false,
    },
    compoundVariants: [
      { isIconOnly: true, size: 'default', className: 'px-3' },
      { isIconOnly: true, size: 'sm', className: 'px-2.5 h-8' },
    ],
  }
)

export type ButtonVariantsProps = VariantProps<typeof buttonVariants>
