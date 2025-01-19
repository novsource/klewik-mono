import * as React from 'react'

import { cn } from '~shared/utils'

import { CardProvider, useCardContext } from '../context/card-context'
import {
  CardStyleProps,
  cardBaseVariants,
  cardContentVariants,
  cardDescriptionVariants,
  cardFooterVariants,
  cardHeaderVariants,
  cardTitleVariants,
} from '../styles/card-variants'

const Card = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & CardStyleProps
>(({ className, size, variant, ...htmlProps }, ref) => {
  const style = React.useMemo(
    () => cn(cardBaseVariants({ size, variant }), className),
    [className, size, variant]
  )

  return (
    <CardProvider variant={variant ?? 'default'} size={size ?? 'default'}>
      <section ref={ref} className={style} {...htmlProps} />
    </CardProvider>
  )
})
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const cardStyleProps = useCardContext()

  const style = React.useMemo(
    () => cn(cardHeaderVariants({ ...cardStyleProps }), className),
    [className, ...Object.keys(cardStyleProps)]
  )

  return <div ref={ref} className={style} {...props} />
})
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const cardStyleProps = useCardContext()

  const style = React.useMemo(
    () => cn(cardTitleVariants({ ...cardStyleProps }), className),
    [className, ...Object.keys(cardStyleProps)]
  )

  return <div ref={ref} className={style} {...props} />
})
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const cardStyleProps = useCardContext()

  const style = React.useMemo(
    () => cn(cardDescriptionVariants({ ...cardStyleProps }), className),
    [className, ...Object.keys(cardStyleProps)]
  )

  return <div ref={ref} className={style} {...props} />
})
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const cardStyleProps = useCardContext()

  const style = React.useMemo(
    () => cn(cardContentVariants({ ...cardStyleProps }), className),
    [className, ...Object.keys(cardStyleProps)]
  )

  return <div ref={ref} className={style} {...props} />
})
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const cardStyleProps = useCardContext()

  const style = React.useMemo(
    () => cn(cardFooterVariants({ ...cardStyleProps }), className),
    [className, ...Object.keys(cardStyleProps)]
  )

  return <div ref={ref} className={style} {...props} />
})
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
