import { forwardRef } from 'react'
import type { ComponentPropsWithRef } from 'react'

export type BaseWheelProps = Omit<ComponentPropsWithRef<'svg'>, 'width' | 'height'> & {
  width?: number
  height?: number
}

export const BaseWheel = forwardRef<SVGSVGElement, BaseWheelProps>((props, forwardRef) => {
  const { width = 0, height = 0, className, ...restProps } = props

  const wheelSize = Math.min(height, width)

  return (
    <svg
      className={className}
      ref={forwardRef}
      width={wheelSize}
      height={wheelSize}
      viewBox={`0 0 ${wheelSize} ${wheelSize}`}
      {...restProps}
    />
  )
})
