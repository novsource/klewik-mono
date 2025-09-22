import type { FlexVariantsProps } from '../styles/flex-variants'

import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'

import { cn } from '~shared/utils'

import { flexVariants } from '../styles/flex-variants'

export type FlexProps<T extends keyof JSX.IntrinsicElements = 'div'>
  = ComponentPropsWithoutRef<T> & FlexVariantsProps & {
    as?: T
    children?: ReactNode
  }

export const Flex = forwardRef(
  <T extends keyof JSX.IntrinsicElements = 'div'>
  (props: FlexProps<T>,
    forwardRef: ForwardedRef<T>,
  ) => {
    const {
      as,
      className,
      justify,
      wrap,
      direction,
      align,
      children,
      ...restProps
    } = props

    const Comp = (as || 'div') as keyof JSX.IntrinsicElements

    const styles = useMemo(
      () => cn(flexVariants({ justify, wrap, direction, align }), className),
      [className, justify, wrap, direction, align],
    )

    return (
      <Comp ref={forwardRef} className={styles} {...restProps}>
        {children}
      </Comp>
    )
  },
)
