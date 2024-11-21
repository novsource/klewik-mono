import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-medium text-body font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-body',
  {
    variants: {
      variant: {
        default: 'bg-dark text-gray-accent hover:bg-opacity-80',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      isIconOnly: {
        true: '',
        false: '',
      },
      size: {
        default: 'h-10 px-3 py-2 text-md leading-6 rounded-md',
        sm: 'h-9 rounded-md px-2 text-sm leading-6',
        lg: 'h-12 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      isIconOnly: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  startContent?: React.ReactNode
  endContent?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, isIconOnly, variant, size, asChild = false, ...props },
    ref
  ) => {
    const { children, startContent, endContent, ...otherProps } = props

    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className, isIconOnly }),
          (startContent || endContent) &&
            'flex items-center justify-center gap-x-1'
        )}
        ref={ref}
        {...otherProps}
      >
        {startContent}
        {!isIconOnly && children}
        {endContent}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
