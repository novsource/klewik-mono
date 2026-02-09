import type { UseWheelReturn } from '../hooks'

import { forwardRef } from 'react'
import type { ComponentPropsWithRef } from 'react'

import { useMergedRefs } from '~shared/hooks'

import { WheelGameContextProvider } from '../context'

export type BaseWheelProps = Omit<ComponentPropsWithRef<'svg'>, 'width' | 'height'> & {
  wheelGame: UseWheelReturn
  width?: number
  height?: number
}

export const BaseWheel = forwardRef<SVGSVGElement, BaseWheelProps>((props, forwardRef) => {
  const { width = 0, height = 0, className, wheelGame, ...restProps } = props

  const mergedRef = useMergedRefs(wheelGame.meta.wheelRef, forwardRef)

  const wheelSize = Math.min(height, width)

  return (
    <WheelGameContextProvider {...wheelGame}>
      <svg
        className={className}
        ref={mergedRef}
        width={wheelSize}
        height={wheelSize}
        viewBox={`0 0 ${wheelSize} ${wheelSize}`}
        {...restProps}
      />
    </WheelGameContextProvider>
  )
})
