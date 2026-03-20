import type { RadioVariantsProps } from '../styles'

import { useMemo } from 'react'
import type { ComponentProps } from 'react'

import { RadioGroup as RadioGroupPrimitive, Radio as RadioPrimitive } from '@base-ui/react'

import { cn } from '~shared/utils'

import { radioIndicatorVariants, radioLabelVariants, radioVariants } from '../styles'

export type RadioGroupProps = RadioGroupPrimitive.Props

const RadioGroup = (props: RadioGroupProps) => {
  const { className, ...restProps } = props
  return <RadioGroupPrimitive className={cn('group', className)} {...restProps} />
}

export type RadioProps = Omit<RadioPrimitive.Root.Props, 'className'> & RadioVariantsProps & {
  slotsClassnames?: Partial<Record<'label' | 'root' | 'indicator', string>>
  indicatorProps?: Omit<RadioPrimitive.Indicator.Props, 'className'>
  labelProps?: Omit<ComponentProps<'label'>, 'className'>
}

const Radio = (props: RadioProps) => {
  const { children, slotsClassnames, indicatorProps, labelProps, variant, size, ...restProps } = props

  const rootStyles = useMemo(() =>
    cn(radioVariants({ variant, size }), slotsClassnames?.root), [slotsClassnames?.root, variant, size])

  const labelStyles = useMemo(() =>
    cn(radioLabelVariants({ variant, size }), slotsClassnames?.label), [slotsClassnames?.label, variant, size])

  const indicatorStyles = useMemo(() =>
    cn(radioIndicatorVariants({ variant, size }), slotsClassnames?.indicator), [slotsClassnames?.indicator, variant, size])

  return (
    <label className={labelStyles} {...labelProps}>
      <RadioPrimitive.Root className={rootStyles} {...restProps}>
        <RadioPrimitive.Indicator className={indicatorStyles} {...indicatorProps} />
      </RadioPrimitive.Root>
      {children}
    </label>
  )
}

export { Radio, RadioGroup }
