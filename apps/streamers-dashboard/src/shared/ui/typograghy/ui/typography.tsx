import { HTMLAttributes, ReactNode, useMemo } from 'react'

import { cn } from '~shared/utils'

import {
  TypographyVariantsProps,
  typographyVariants,
} from '../styles/typography-variants'

export type TypographyTags = 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p'

type TypographyHTMLElements = Pick<HTMLElementTagNameMap, TypographyTags>

type TypographyProps<T extends keyof TypographyHTMLElements> = {
  tag: T
  children: ReactNode
} & Omit<TypographyVariantsProps, 'tag'> &
  HTMLAttributes<TypographyHTMLElements[T]>

const Typography = <T extends keyof TypographyHTMLElements>({
  children,
  tag,
  className,
  ...props
}: TypographyProps<T>) => {
  const Comp = tag as keyof Pick<JSX.IntrinsicElements, TypographyTags>

  const styles = useMemo(
    () => cn(typographyVariants({ tag }), className),
    [className, tag]
  )

  return (
    <Comp className={styles} {...props}>
      {children}
    </Comp>
  )
}

export default Typography
