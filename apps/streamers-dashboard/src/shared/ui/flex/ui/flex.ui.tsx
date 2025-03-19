import { ComponentProps, useMemo } from 'react'

import { cn } from '~shared/utils'

import { FlexVariantsProps, flexVariants } from '../styles/flex-variants'

type FlexProps = Omit<ComponentProps<'div'>, 'align'> &
  FlexVariantsProps & {
    component?: Omit<keyof JSX.IntrinsicElements, 'svg'>
  }

const Flex = ({
  className,
  component,
  justify,
  wrap,
  direction,
  align,
  ...otherProps
}: FlexProps) => {
  const Comp = component ?? ('div' as keyof JSX.IntrinsicElements)

  const styles = useMemo(
    () => cn(flexVariants({ justify, wrap, direction, align }), className),
    [className, justify, wrap, direction, align]
  )

  return <Comp className={styles} {...otherProps} />
}

export { Flex }
