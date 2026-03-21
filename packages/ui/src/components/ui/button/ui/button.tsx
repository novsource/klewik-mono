'use client'

import type { ComponentProps, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'

import { Icons } from '../../icons'

import { cn, toBooleanString } from '../../../../utils/index'

import { buttonVariants, ButtonVariantsProps } from '../styles/button-variants'

export type ButtonProps = {
  loading?: boolean
  startContent?: ReactNode
  endContent?: ReactNode
  icon?: ReactNode
} & ComponentProps<'button'> & Omit<ButtonVariantsProps, 'startContent' | 'endContent'>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, isIconOnly, variant, size, icon, ...props },
    ref,
  ) => {
    const { children, startContent, endContent, loading = false, disabled, ...restProps } = props

    const classes = useMemo(
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
