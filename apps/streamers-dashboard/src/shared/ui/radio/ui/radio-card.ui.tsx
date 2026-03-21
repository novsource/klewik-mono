import type { RadioProps } from './radio.ui'

import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { Radio as RadioPrimitive } from '@base-ui/react'
import { Card, CardContent } from 'klewik-ui/card'
import { Flex } from 'klewik-ui/flex'

import type { TextProps } from '~shared/components/typography'
import { Text } from '~shared/components/typography'

import { cn, mergeProps } from '~shared/utils'

import { radioIndicatorVariants, radioLabelVariants, radioVariants } from '../styles'
import { radioCardVariants } from '../styles/radio-card.variants'

export type RadioCardProps = RadioProps & {
  icon?: ReactNode
}

export const RadioCard = (props: RadioCardProps) => {
  const {
    children,
    slotsClassnames,
    indicatorProps,
    disabled,
    labelProps,
    variant,
    size,
    icon,
    ...restProps
  } = props

  const rootClasses = useMemo(() =>
    cn(radioVariants({ variant, size }), slotsClassnames?.root), [slotsClassnames?.root, variant, size])
  const labelClasses = useMemo(() =>
    cn(radioLabelVariants({ variant, size }), slotsClassnames?.label), [slotsClassnames?.label, variant, size])
  const indicatorClasses = useMemo(() =>
    cn(radioIndicatorVariants({ variant, size }), slotsClassnames?.indicator), [slotsClassnames?.indicator, variant, size])

  const cardBaseClasses = useMemo(() => cn(radioCardVariants()), [])

  const mergedLabelProps = mergeProps(labelProps, {
    className: labelClasses,
  })

  return (
    <label {...mergedLabelProps}>
      <Card className={cardBaseClasses} aria-disabled={disabled}>
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
            <RadioPrimitive.Root className={rootClasses} disabled={disabled} {...restProps}>
              <RadioPrimitive.Indicator className={indicatorClasses} {...indicatorProps} />
            </RadioPrimitive.Root>
          </Flex>
        </CardContent>
      </Card>
    </label>
  )
}

export const RadioCardTitle = (props: TextProps) => {
  const { className, ...restProps } = props

  return <Text className={cn('text-white/80 font-semibold', className)} asSpan {...restProps} />
}

export const RadioCardDescription = (props: TextProps) => {
  const { className, ...restProps } = props

  return <Text className={cn('text-gray-light', className)} asSpan {...restProps} />
}
