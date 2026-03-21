import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import type { ClassValue } from 'class-variance-authority/types'

type BadgeSizes = {
  size: Record<'sm' | 'default' | 'lg', ClassValue>
}

type BadgeVariants = {
  variant: {
    success: ClassValue
    error: ClassValue
    info: ClassValue
    default: ClassValue
    warning: ClassValue
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
