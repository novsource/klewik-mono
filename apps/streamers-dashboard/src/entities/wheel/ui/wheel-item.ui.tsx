import type { WheelSlot } from '../model'

import { useMemo } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

import { cn, convertDegreesToRadians, getCoordsOfDotByVectorAngle } from '~shared/utils'

export type WheelItemProps = ComponentPropsWithoutRef<'path'> & {
  slot: WheelSlot
  radius: number
  center: {
    x: number
    y: number
  }
  gapAngle?: number
}

export const WheelItem = (props: WheelItemProps) => {
  const {
    slot,
    center,
    className,
    radius,
    gapAngle = 0.65,
    ...restProps
  } = props

  const coords = useMemo(() => {
    const bottomRadius = radius * 0.9

    const radStartAngleWithPadding = convertDegreesToRadians(slot.startAngle + gapAngle / 2)
    const radEndAngleWithPadding = convertDegreesToRadians(slot.endAngle - gapAngle / 2)

    const anglesDiff = radStartAngleWithPadding - radEndAngleWithPadding
    const radiusDiff = radius - bottomRadius

    const anglesPadding = anglesDiff * 0
    const radiusPadding = radiusDiff * 0

    const startAngleForBezier = radStartAngleWithPadding - anglesPadding
    const endAngleForBezier = radEndAngleWithPadding + anglesPadding

    const startRadiusForBezier = radius - radiusPadding
    const endRadiusForBezier = bottomRadius + radiusPadding

    // console.log(radEndAngleWithPadding, radEndAngleWithPadding, anglesDiff * 0.985, anglesDiff * 0.15)
    // console.log(`id: ${slot.id};\nangle: ${angle};\ncoords: {x: ${coords.x}, y: ${coords.y}};\ntitle: ${slot.title}\ncenter: {x: ${center.x}; y: ${center.y}}\n`)
    // console.log(`id: ${slot.id};\nangle: ${currentSlotStartAngle};\ncoords: {x: ${currentSlotCoordsWithPadding.x}, y: ${currentSlotCoordsWithPadding.y}};\ntitle: ${slot.title}\ncenter: {x: ${center.x}; y: ${center.y}}\n`)

    return {
      // Start point
      1: getCoordsOfDotByVectorAngle(center.x, center.y, startRadiusForBezier, radStartAngleWithPadding),

      // Bezier curve: 1 - start point, 2 - target point, 3 - end point
      2: getCoordsOfDotByVectorAngle(center.x, center.y, radius, radStartAngleWithPadding),
      3: getCoordsOfDotByVectorAngle(center.x, center.y, radius, startAngleForBezier),

      // Arc curve: 3 - start point, 4 - end point
      4: getCoordsOfDotByVectorAngle(center.x, center.y, radius, endAngleForBezier),

      // Bezier curve: 4 - start point, 5 - target point, 6 - end point
      5: getCoordsOfDotByVectorAngle(center.x, center.y, radius, radEndAngleWithPadding),
      6: getCoordsOfDotByVectorAngle(center.x, center.y, startRadiusForBezier, radEndAngleWithPadding),

      // Line: 6 - start point, 7 - end point
      7: getCoordsOfDotByVectorAngle(center.x, center.y, endRadiusForBezier, radEndAngleWithPadding),

      // Bezier curve: 7 - start point, 8 - target point, 9 - end point
      8: getCoordsOfDotByVectorAngle(center.x, center.y, bottomRadius, radEndAngleWithPadding),
      9: getCoordsOfDotByVectorAngle(center.x, center.y, bottomRadius, endAngleForBezier),

      // Arc curve: 9 - start point, 10 - end point
      10: getCoordsOfDotByVectorAngle(center.x, center.y, bottomRadius, startAngleForBezier),

      // Bezier curve: 10 - start point, 11 - target point, 12 - end point
      11: getCoordsOfDotByVectorAngle(center.x, center.y, bottomRadius, radStartAngleWithPadding),
      12: getCoordsOfDotByVectorAngle(center.x, center.y, endRadiusForBezier, radStartAngleWithPadding),
    }
  }, [radius, gapAngle, center, slot.startAngle, slot.endAngle])

  const path = useMemo(() => {
    const bottomRadius = radius * 0.9

    const isLargeArc = Math.abs(slot.endAngle - slot.startAngle) >= 180

    const startPointQuery = `M${coords[1].x},${coords[1].y}`
    const topLeftRoundQuery = `Q${coords[2].x},${coords[2].y} ${coords[3].x},${coords[3].y}`
    const topArcQuery = `A${radius},${radius} 0 ${isLargeArc ? 1 : 0} 1 ${coords[4].x},${coords[4].y}`
    const topRightRoundQuery = `Q${coords[5].x},${coords[5].y} ${coords[6].x},${coords[6].y}`
    const connectToBottomRightRoundQuery = `L${coords[7].x},${coords[7].y}`
    const bottomRightRoundQuery = `Q${coords[8].x},${coords[8].y} ${coords[9].x},${coords[9].y}`
    const bottomArcQuery = `A${bottomRadius},${bottomRadius} 0 ${isLargeArc ? 1 : 0} 0 ${coords[10].x},${coords[10].y}`
    const bottomLeftRoundQuery = `Q${coords[11].x},${coords[11].y} ${coords[12].x},${coords[12].y}`

    const figureParts = [
      startPointQuery,
      topLeftRoundQuery,
      topArcQuery,
      topRightRoundQuery,
      connectToBottomRightRoundQuery,
      bottomRightRoundQuery,
      bottomArcQuery,
      bottomLeftRoundQuery,
    ]

    return `${figureParts.join(' ')} Z`
  }, [coords, radius, slot.startAngle, slot.endAngle])

  return (
    <path
      className={cn(className)}
      id={slot.title}
      d={path}
      fill={slot.color}
      {...restProps}
    />
  )
}
