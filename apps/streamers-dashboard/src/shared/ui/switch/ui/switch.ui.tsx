import type { SwitchVariantsProps } from '../styles/switch-variants'

import type { ComponentPropsWithRef } from 'react'
import { forwardRef } from 'react'

import * as SwitchPrimitive from '@base-ui-components/react/switch'

import { cn } from '~shared/utils'

import { switchThumbVariants, switchVariants } from '../styles/switch-variants'

export type SwitchProps = ComponentPropsWithRef<typeof SwitchPrimitive.SwitchRoot> & SwitchVariantsProps

export const Switch = forwardRef<HTMLDivElement, SwitchProps>((props, forwardRef) => {
  const { className, size, ...restProps } = props

  return (
    <SwitchPrimitive.Switch.Root
      ref={forwardRef}
      className={cn(switchVariants({ size }), className)}
      {...restProps}
    >
      <SwitchPrimitive.Switch.Thumb className={cn(switchThumbVariants(), 'transition-all')} />
    </SwitchPrimitive.Switch.Root>
  )
})
