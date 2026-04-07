import { ComponentPropsWithoutRef, forwardRef, useMemo } from "react"
import { stackVariants, StackVariantsProps } from "../styles/stack.variants"

export type StackProps = ComponentPropsWithoutRef<'div'> & StackVariantsProps

export const Stack = forwardRef<HTMLDivElement, StackProps>((props, forwardRef) => {
  const { className, gap, justify, align, ...restProps } = props

  const classes = useMemo(() => stackVariants({ gap, justify, align, className }), [className, gap, justify, align])

  return <div ref={forwardRef} className={classes} {...restProps} />
})
