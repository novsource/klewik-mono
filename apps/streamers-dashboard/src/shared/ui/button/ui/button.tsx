import type { ButtonVariantsProps } from '../styles/button-variants'

import * as React from 'react'

import { Icons } from '~shared/ui/icons'

import { cn, toBooleanString } from '~shared/utils'

import { buttonVariants } from '../styles/button-variants'

export type ButtonProps = {
  loading?: boolean
  startContent?: React.ReactNode
  endContent?: React.ReactNode
  icon?: React.ReactNode
} & React.ComponentProps<'button'> & Omit<ButtonVariantsProps, 'startContent' | 'endContent'>

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, isIconOnly, variant, size, icon, ...props },
    ref,
  ) => {
    const { children, startContent, endContent, loading = false, disabled, ...restProps } = props

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

    const isButtonDisabled = loading || disabled

    return (
      <button
        type="button"
        className={cn(classes, '[data-loading=true]:[&>*]:hidden')}
        ref={ref}
        data-icon-only={toBooleanString(isIconOnly)}
        data-loading={loading}
        disabled={isButtonDisabled}
        {...restProps}
      >
        {!loading
          ? (
              <>
                {!isIconOnly && startContent}
                {!isIconOnly && children}
                {isIconOnly && icon}
                {!isIconOnly && endContent}
              </>
            )
          : <Icons.Loading className="data-[loading=true]:visible" />}
      </button>
    )
  },
)
Button.displayName = 'Button'
