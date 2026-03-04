import type { CaptionStylesProps } from '../styles/caption-variants'

import type { ComponentPropsWithoutRef } from 'react'
import { useMemo } from 'react'

import { mergeProps } from '@base-ui/react'

import type { TextProps } from '~shared/components/typography'
import { Text } from '~shared/components/typography'

import { cn } from '~shared/utils/react'

import { captionTitleVariants, captionVariants } from '../styles/caption-variants'

export type CaptionProps = ComponentPropsWithoutRef<'div'> & CaptionStylesProps & {
  title?: string
  titleProps?: Omit<TextProps, 'children' | 'span' | 'asSpan'>
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
    cn(captionTitleVariants({ variant })), [variant])

  const mergedTitleProps = mergeProps(
    titleProps,
    {
      className: titleStyles,
    },
  )

  return (
    <div
      className={baseStyles}
      data-slot="base"
      {...restProps}
    >
      {title && <Text {...mergedTitleProps} asSpan>{title}</Text>}
      {children}
    </div>
  )
}
