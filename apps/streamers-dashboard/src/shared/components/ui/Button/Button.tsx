import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'
import { ButtonVariantsProps, buttonVariants } from './ButtonVariants'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<ButtonVariantsProps, 'startContent' | 'endContent'> {
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

    const style = React.useMemo(
      () =>
        cn(
          buttonVariants({
            variant,
            size,
            isIconOnly,
            startContent: !!startContent,
            endContent: !!endContent,
          }),
          className
        ),
      [isIconOnly, variant, size, startContent, endContent]
    )

    return (
      <Comp className={style} ref={ref} {...otherProps}>
        {startContent}
        {!isIconOnly && children}
        {endContent}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
