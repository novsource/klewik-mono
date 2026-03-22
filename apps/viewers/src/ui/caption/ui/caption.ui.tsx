import type { ComponentProps } from 'react'
import type { TypographyProps } from 'klewik-ui/typography'
import type { CaptionStylesProps } from '../styles/caption-variants'

import { mergeProps } from '@base-ui-components/react'
import { useMemo } from 'react'
import { Typography } from 'klewik-ui/typography'

import { cn } from '~utils/cn'
import { captionTitleVariants, captionVariants } from '../styles/caption-variants'

export type CaptionProps = ComponentProps<'div'> & CaptionStylesProps & {
  title?: string
  titleProps?: Omit<TypographyProps<'span'>, 'children' | 'span'>
}

export const Caption = (props: CaptionProps) => {
  const {
    title,
    className,
    variant,
    titleProps,
    size,
    children,
    ...restProps
  } = props

  const baseStyles = useMemo(() =>
    cn(captionVariants({ variant, size }), className), [variant, size, className])
  const titleStyles = useMemo(() =>
    cn(captionTitleVariants({ variant }), className), [variant, className])

  const mergedTitleProps = mergeProps<typeof Typography>(
    titleProps,
    {
      className: titleStyles,
      tag: 'span',
    },
  )

  return (
    <div
      className={baseStyles}
      data-slot="base"
      {...restProps}
    >
      {title && <Typography {...mergedTitleProps}>{title}</Typography>}
      {children}
    </div>
  )
}
