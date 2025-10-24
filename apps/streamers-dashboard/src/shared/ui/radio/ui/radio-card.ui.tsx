import type { RadioProps } from './radio.ui'

import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { Radio as RadioPrimitive } from '@base-ui-components/react'

import { Card, CardContent } from '~shared/ui/card'
import { Flex } from '~shared/ui/flex'
import type { TypographyProps } from '~shared/ui/typograghy'
import { Typography } from '~shared/ui/typograghy'

import { cn, mergeProps } from '~shared/utils'

import { radioIndicatorVariants, radioLabelVariants, radioVariants } from '../styles'

export type RadioCardProps = RadioProps & {
  icon?: ReactNode
}

export const RadioCard = (props: RadioCardProps) => {
  const {
    children,
    slotsClassnames,
    indicatorProps,
    labelProps,
    variant,
    size,
    icon,
    ...restProps
  } = props

  const rootStyles = useMemo(() =>
    cn(radioVariants({ variant, size }), slotsClassnames?.root), [slotsClassnames?.root, variant, size])

  const labelStyles = useMemo(() =>
    cn(radioLabelVariants({ variant, size }), slotsClassnames?.label), [slotsClassnames?.label, variant, size])

  const indicatorStyles = useMemo(() =>
    cn(radioIndicatorVariants({ variant, size }), slotsClassnames?.indicator), [slotsClassnames?.indicator, variant, size])

  const mergedLabelProps = mergeProps(labelProps, {
    className: labelStyles,
  })

  return (
    <label {...mergedLabelProps}>
      <Card className="w-full flex flex-row justify-between py-1.5">
        <CardContent className="w-full flex-row gap-x-3 justify-between">
          <Flex className={cn(!!icon && 'gap-x-4')}>
            <Flex className="h-full shrink-0 items-center">
              {icon}
            </Flex>
            <Flex className="gap-y-0.5 mobile:gap-y-1" direction="column">
              {children}
            </Flex>
          </Flex>
          <Flex className="h-full w-fit items-start">
            <RadioPrimitive.Root className={rootStyles} {...restProps}>
              <RadioPrimitive.Indicator className={indicatorStyles} {...indicatorProps} />
            </RadioPrimitive.Root>
          </Flex>
        </CardContent>
      </Card>
    </label>
  )
}

export type RadioCardTitleProps = Omit<TypographyProps<'span'>, 'tag'>

export const RadioCardTitle = (props: RadioCardTitleProps) => {
  const { className, ...restProps } = props

  return <Typography className={cn('text-white/80 font-semibold', className)} tag="span" {...restProps} />
}

export type RadioCardDescriptionProps = Omit<TypographyProps<'span'>, 'tag'>

export const RadioCardDescription = (props: RadioCardTitleProps) => {
  const { className, ...restProps } = props

  return <Typography className={cn('text-gray-light', className)} tag="span" {...restProps} />
}
