import { HTMLAttributes, ReactNode, useMemo } from 'react'
import {
  TypographyVariantsProps,
  typographyVariants,
} from './TypographyVariants'
import { cn } from '@/lib/utils'

type TypographyElements = 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p'

type TypographyHTMLElements = Pick<HTMLElementTagNameMap, TypographyElements>

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
  const Comp = tag as keyof Pick<JSX.IntrinsicElements, TypographyElements>

  const styles = useMemo(
    () => cn(typographyVariants({ tag }), className),
    [tag]
  )

  return (
    <Comp className={styles} {...props}>
      {children}
    </Comp>
  )
}

export default Typography
