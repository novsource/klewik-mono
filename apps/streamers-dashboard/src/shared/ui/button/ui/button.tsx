import type { ButtonVariantsProps } from '../styles/button-variants'

import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'

import { cn } from '~shared/utils'

import { buttonVariants } from '../styles/button-variants'

export type ButtonProps = {
  asChild?: boolean
  startContent?: React.ReactNode
  endContent?: React.ReactNode
  icon?: React.ReactNode
} & React.ComponentProps<'button'> & Omit<ButtonVariantsProps, 'startContent' | 'endContent'>

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, isIconOnly, variant, size, icon, asChild = false, ...props },
    ref,
  ) => {
    const { children, startContent, endContent, ...otherProps } = props

    const Comp = asChild ? Slot : 'button'

    const style = React.useMemo(
      () =>
        cn(buttonVariants({
          variant,
          size,
          isIconOnly,
          startContent: !!startContent,
          endContent: !!endContent,
          className,
        }), className),
      [isIconOnly, variant, size, startContent, endContent, className],
    )

    return (
      <Comp
        className={style}
        ref={ref}
        data-icon-only={isIconOnly}
        {...otherProps}
      >
        {startContent}
        {!isIconOnly && children}
        {isIconOnly && icon}
        {endContent}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
