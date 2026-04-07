'use client'

import type {
  CardStyleProps,
} from '../styles/card-variants'

import type { ComponentProps } from 'react'
import { forwardRef, useMemo } from 'react'

import { cn, objectToDeps } from '../../../../utils/index'

import { CardProvider, useCardContext } from '../context/card-context'
import {
  cardBaseVariants,
  cardContentVariants,
  cardDescriptionVariants,
  cardFooterVariants,
  cardHeaderVariants,
  cardTitleVariants,
} from '../styles/card-variants'

export type CardProps = ComponentProps<'div'> & CardStyleProps

export const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const { className, size, variant, ...restProps } = props

  const classes = useMemo(() =>
    cn(cardBaseVariants({ size, variant, className })), [className, ...objectToDeps(props)])

  return (
    <CardProvider variant={variant ?? 'default'} size={size ?? 'default'}>
      <div ref={ref} className={classes} {...restProps} />
    </CardProvider>
  )
})
Card.displayName = 'Card'

export type CardHeaderProps = ComponentProps<'div'>

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>((props, ref) => {
  const { className, ...restProps } = props

  const cardStyleProps = useCardContext()

  const style = useMemo(
    () => cn(cardHeaderVariants({ ...cardStyleProps }), className),
    [className, ...objectToDeps(cardStyleProps)],
  )

  return <div ref={ref} className={style} {...restProps} />
})
CardHeader.displayName = 'CardHeader'

export type CardTitleProps = ComponentProps<'div'>

export const CardTitle = forwardRef<HTMLDivElement, CardTitleProps>((props, ref) => {
  const { className, ...restProps } = props

  const cardStyleProps = useCardContext()

  const style = useMemo(
    () => cn(cardTitleVariants({ ...cardStyleProps }), className),
    [className, ...objectToDeps(cardStyleProps)],
  )

  return <div ref={ref} className={style} {...restProps} />
})
CardTitle.displayName = 'CardTitle'

export type CardDescriptionProps = ComponentProps<'div'>

export const CardDescription = forwardRef<HTMLDivElement, CardDescriptionProps>((props, ref) => {
  const { className, ...restProps } = props
  const cardStyleProps = useCardContext()

  const style = useMemo(
    () => cn(cardDescriptionVariants({ ...cardStyleProps }), className),
    [className, ...objectToDeps(cardStyleProps)],
  )

  return <div ref={ref} className={style} {...restProps} />
})
CardDescription.displayName = 'CardDescription'

export type CardContentProps = ComponentProps<'div'>

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>((props, ref) => {
  const { className, ...restProps } = props

  const cardStyleProps = useCardContext()

  const style = useMemo(
    () => cn(cardContentVariants({ ...cardStyleProps }), className),
    [className, ...objectToDeps(cardStyleProps)],
  )

  return <div ref={ref} className={style} {...restProps} />
})
CardContent.displayName = 'CardContent'

export type CardFooterProps = ComponentProps<'div'>

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>((props, ref) => {
  const { className, ...restProps } = props

  const cardStyleProps = useCardContext()

  const style = useMemo(
    () => cn(cardFooterVariants({ ...cardStyleProps }), className),
    [className, ...objectToDeps(cardStyleProps)],
  )

  return <div ref={ref} className={style} {...restProps} />
})
CardFooter.displayName = 'CardFooter'
