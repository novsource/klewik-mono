import { VariantProps, cva } from 'class-variance-authority'

import { CvaClassValue } from '~shared/utils/types'

type BadgeVariants = {
  variant: {
    success: CvaClassValue
    error: CvaClassValue
    default: CvaClassValue
    warning: CvaClassValue
  }
}

const badgeVariants = cva<BadgeVariants>(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-gray-accent/30 text-gray-accent',
        error: 'border-transparent bg-red/30 text-red',
        success: 'border-transparent bg-green/30 text-green',
        warning: 'border-transparent bg-yellow/30 text-yellow',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

type BadgeStylesProps = VariantProps<typeof badgeVariants>

export { badgeVariants, type BadgeStylesProps }
