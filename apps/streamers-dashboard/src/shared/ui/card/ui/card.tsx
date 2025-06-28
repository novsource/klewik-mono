import type {
  CardStyleProps,
} from '../styles/card-variants'

import { forwardRef, useMemo } from 'react'

import { cn, objectToDeps } from '~shared/utils'

import { CardProvider, useCardContext } from '../context/card-context'
import {
  cardBaseVariants,
  cardContentVariants,
  cardDescriptionVariants,
  cardFooterVariants,
  cardHeaderVariants,
  cardTitleVariants,
} from '../styles/card-variants'

export type CardProps = React.ComponentProps<'div'> & CardStyleProps

const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const { className, size, variant, ...restProps } = props

  const style = useMemo(() =>
    cn(cardBaseVariants({ size, variant }), className), [className, ...objectToDeps(props)])

  return (
    <CardProvider variant={variant ?? 'default'} size={size ?? 'default'}>
      <div ref={ref} className={style} {...restProps} />
    </CardProvider>
  )
})
Card.displayName = 'Card'

const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const cardStyleProps = useCardContext()

  const style = useMemo(
    () => cn(cardHeaderVariants({ ...cardStyleProps }), className),
    [className, ...objectToDeps(cardStyleProps)],
  )

  return <div ref={ref} className={style} {...props} />
})
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const cardStyleProps = useCardContext()

  const style = useMemo(
    () => cn(cardTitleVariants({ ...cardStyleProps }), className),
    [className, ...objectToDeps(cardStyleProps)],
  )

  return <div ref={ref} className={style} {...props} />
})
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const cardStyleProps = useCardContext()

  const style = useMemo(
    () => cn(cardDescriptionVariants({ ...cardStyleProps }), className),
    [className, ...objectToDeps(cardStyleProps)],
  )

  return <div ref={ref} className={style} {...props} />
})
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const cardStyleProps = useCardContext()

  const style = useMemo(
    () => cn(cardContentVariants({ ...cardStyleProps }), className),
    [className, ...objectToDeps(cardStyleProps)],
  )

  return <div ref={ref} className={style} {...props} />
})
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const cardStyleProps = useCardContext()

  const style = useMemo(
    () => cn(cardFooterVariants({ ...cardStyleProps }), className),
    [className, ...objectToDeps(cardStyleProps)],
  )

  return <div ref={ref} className={style} {...props} />
})
CardFooter.displayName = 'CardFooter'

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
