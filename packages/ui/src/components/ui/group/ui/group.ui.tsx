import { ComponentPropsWithoutRef, forwardRef, useMemo } from "react"

import { groupVariants, GroupVariantsProps } from "../styles/group.styles"

export type GroupProps = ComponentPropsWithoutRef<'div'> & GroupVariantsProps

export const Group = forwardRef<HTMLDivElement, GroupProps>((props, forwardRef) => {
  const { className, gap, justify, align, ...restProps } = props

  const classes = useMemo(() => groupVariants({ gap, justify, align, className }), [className, gap, justify, align])

  return <div ref={forwardRef} className={classes} {...restProps} />
})
