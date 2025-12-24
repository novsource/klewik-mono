import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import type { CvaClassValue } from '~shared/utils/types'

type BadgeSizes = {
  size: Record<'sm' | 'default' | 'lg', CvaClassValue>
}

type BadgeVariants = {
  variant: {
    success: CvaClassValue
    error: CvaClassValue
    default: CvaClassValue
    warning: CvaClassValue
  }
}

export const badgeVariants = cva<BadgeVariants & BadgeSizes>(
  'inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-gray-accent/20 text-gray-accent',
        error: 'border-transparent bg-red/20 text-red',
        success: 'border-transparent bg-green/20 text-green',
        warning: 'border-transparent bg-yellow/20 text-yellow',
      },
      size: {
        sm: 'text-xs px-1.25 py-0.5',
        default: 'text-sm px-1.5 py-0.5',
        lg: 'text-sm px-1.75 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type BadgeStylesProps = VariantProps<typeof badgeVariants>
