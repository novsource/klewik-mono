import type { ComponentPropsWithoutRef } from 'react'
import { useMemo } from 'react'

import { cn, convertDegreesToRadians, getCoordsOfDotByVectorAngle } from '~shared/utils'

export type WheelSelectorProps = ComponentPropsWithoutRef<'svg'> & {
  size: number
  center: {
    x: number
    y: number
  }
  radius?: number
  startAngle?: number
  endAngle?: number
}

export const WheelSelector = (props: WheelSelectorProps) => {
  const {
    size: wheelSize,
    center,
    radius = wheelSize / 2,
    startAngle = 240,
    endAngle = 300,
    className,
    ...restProps
  } = props

  const coords = useMemo(() => {
    const radStartAngle = convertDegreesToRadians(startAngle)
    const radEndAngle = convertDegreesToRadians(endAngle)

    const startCoords = getCoordsOfDotByVectorAngle(center.x, center.y, radius, radStartAngle)
    const endCoords = getCoordsOfDotByVectorAngle(center.x, center.y, radius, radEndAngle)

    return { start: startCoords, end: endCoords }
  }, [startAngle, endAngle, center, radius])

  const arrowCoords = useMemo(() => {
    const radStartAngle = convertDegreesToRadians(startAngle)
    const radEndAngle = convertDegreesToRadians(endAngle)

    const middleAngle = (radStartAngle + radEndAngle) / 2

    const arrowStartAngle = middleAngle - (middleAngle * 0.0075)
    const arrowEndAngle = middleAngle + (middleAngle * 0.0075)

    const startCoords = getCoordsOfDotByVectorAngle(center.x, center.y, radius, arrowStartAngle)
    const middleCoords = getCoordsOfDotByVectorAngle(center.x, center.y, radius, middleAngle)
    const endCoords = getCoordsOfDotByVectorAngle(center.x, center.y, radius, arrowEndAngle)

    return { start: startCoords, middle: { x: middleCoords.x, y: middleCoords.y - 10 }, end: endCoords }
  }, [startAngle, endAngle, center, radius])

  return (
    <svg className={cn('w-full h-full overflow-visible', className)} {...restProps}>
      <path
        d={`M${coords.start.x},${coords.start.y} A${radius},${radius} 0 0 1 ${coords.end.x},${coords.end.y}`}
        fill="none"
        stroke="var(--color-white-accent)"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <path
        d={`M${arrowCoords.start.x},${arrowCoords.start.y} L${arrowCoords.middle.x},${arrowCoords.middle.y} L${arrowCoords.end.x},${arrowCoords.end.y}`}
        fill="var(--color-white-accent)"
        stroke="var(--color-white-accent)"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  )
}
