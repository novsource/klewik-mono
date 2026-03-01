import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import type { CvaClassValue } from '~shared/lib/cva'

type BadgeSizes = {
  size: Record<'sm' | 'default' | 'lg', CvaClassValue>
}

type BadgeVariants = {
  variant: {
    success: CvaClassValue
    error: CvaClassValue
    info: CvaClassValue
    default: CvaClassValue
    warning: CvaClassValue
  }
}

export const badgeVariants = cva<BadgeVariants & BadgeSizes>(
  'inline-flex items-center rounded-full border font-semibold transition-colors border-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-gray-accent/20 text-gray-accent',
        info: 'bg-blue/10 text-blue',
        error: 'bg-red/20 text-red',
        success: 'bg-green/10 text-green-accent/60',
        warning: 'bg-yellow/20 text-yellow',
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
