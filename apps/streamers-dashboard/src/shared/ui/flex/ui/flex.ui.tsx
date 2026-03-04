import type { FlexVariantsProps } from '../styles/flex-variants'

import type { ComponentPropsWithoutRef, ElementType, ForwardedRef } from 'react'
import { forwardRef, useMemo } from 'react'

import { cn, isFunction } from '~shared/utils'

import { flexVariants } from '../styles/flex-variants'

export type FlexProps<T extends ElementType = 'div'>
  = FlexVariantsProps & {
    as?: T
  } & ComponentPropsWithoutRef<T>

export const Flex = forwardRef(<T extends ElementType = 'div'>(props: FlexProps<T>, forwardRef: ForwardedRef<T>) => {
  const {
    as,
    className,
    justify,
    wrap,
    direction,
    align,
    ...restProps
  } = props

  const RenderComponent = (as === 'svg' ? 'div' : as || 'div')

  const styles = useMemo(
    () => cn(flexVariants({ justify, wrap, direction, align }), className),
    [className, justify, wrap, direction, align],
  )

  return (
    <RenderComponent
      ref={(instance) => {
        if (isFunction(forwardRef)) {
          forwardRef(instance as NullablePossible<T>)
        }
        else if (forwardRef !== null) {
          forwardRef.current = instance as NullablePossible<T>
        }
      }}
      className={styles}
      {...restProps}
    />
  )
})
