import type { ButtonVariantsProps } from '../styles/button-variants'

import * as React from 'react'

import { cn, toBooleanString } from '~shared/utils'

import { buttonVariants } from '../styles/button-variants'

export type ButtonProps = {
  startContent?: React.ReactNode
  endContent?: React.ReactNode
  icon?: React.ReactNode
} & React.ComponentProps<'button'> & Omit<ButtonVariantsProps, 'startContent' | 'endContent'>

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, isIconOnly, variant, size, icon, ...props },
    ref,
  ) => {
    const { children, startContent, endContent, ...otherProps } = props

    const classes = React.useMemo(
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
      <button
        type="button"
        className={classes}
        ref={ref}
        data-icon-only={toBooleanString(isIconOnly)}
        {...otherProps}
      >
        {!isIconOnly && startContent}
        {!isIconOnly && children}
        {isIconOnly && icon}
        {!isIconOnly && endContent}
      </button>
    )
  },
)
Button.displayName = 'Button'
