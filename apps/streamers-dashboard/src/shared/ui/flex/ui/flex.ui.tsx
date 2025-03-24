import { ComponentProps, forwardRef, useMemo } from 'react'

import { cn } from '~shared/utils'

import { FlexVariantsProps, flexVariants } from '../styles/flex-variants'

type FlexProps = Omit<ComponentProps<'div'>, 'align'> &
  FlexVariantsProps & {
    component?: Omit<keyof JSX.IntrinsicElements, 'svg'>
  }

const Flex = forwardRef<HTMLElement, FlexProps>(
  (
    { className, component, justify, wrap, direction, align, ...otherProps },
    forwardRef
  ) => {
    const Comp = component ?? ('div' as keyof JSX.IntrinsicElements)

    const styles = useMemo(
      () => cn(flexVariants({ justify, wrap, direction, align }), className),
      [className, justify, wrap, direction, align]
    )

    return <Comp ref={forwardRef} className={styles} {...otherProps} />
  }
)

export { Flex }
