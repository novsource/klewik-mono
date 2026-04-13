import type { UseWheelCanvasReturn } from '../hooks'

import { useEffect, useMemo } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

import { useElementSize, useMount, useResizeObserver } from '~shared/hooks'

import { Group } from 'klewik-ui/group'
import { Stack } from 'klewik-ui/stack'
import { Text } from 'klewik-ui/typography'

const wheelMask = `linear-gradient(
  #000,
  #000,
  transparent 0,
  #000 0px,
  #000 90%,
  transparent
)`

export type CanvasWheelOfFortuneProps = ComponentPropsWithoutRef<'canvas'> & {
  wheel: UseWheelCanvasReturn
}

export const CanvasWheelOfFortune = (props: CanvasWheelOfFortuneProps) => {
  const { wheel, style, ...restProps } = props

  const { ref: containerRef, value: containerSize } = useElementSize<HTMLDivElement>()

  const wheelSize = useMemo(() => Math.min(containerSize.height, containerSize.width), [containerSize.height, containerSize.width])

  useMount(() => wheel.render.initDraw(wheel.state.wheelSlots))

  useResizeObserver(containerRef, {
    onChange: () => {
      wheel.render.resizeWheel(wheel.state.wheelSlots)
      wheel.render.resizeInnerBackground()
    },
  })

  useEffect(() => {
    wheel.render.drawWheel(wheel.state.wheelSlots)
  }, [wheel.render.drawWheel, wheel.state.wheelSlots])

  return (
    <Stack ref={containerRef} className="shrink w-full h-full" gap="lg">
      <Text className="text-center text-title desktop:text-title-lg font-semibold" asSpan>
        {wheel.state.selectorCurrentSlot || 'Ожидание начала прокручивания...'}
      </Text>

      <Group className="w-full h-full" align="flex-start" justify="center">
        <Group className="relative w-full h-full" align="flex-start" justify="center">

          <div className="relative overflow-clip" style={{ maskImage: wheelMask }}>
            <canvas
              ref={wheel.meta.wheelRef}
              style={{
                ...style,
                willChange: 'transform',
                transform: `rotateZ(${wheel.state.rotateValue}deg)`,
              }}
              {...restProps}
            />

            <canvas
              ref={wheel.meta.innerRef}
              className="absolute top-0"
              style={{ clipPath: 'circle(46%)' }}
            />

            <div className="absolute -top-3 left-1/2 -translate-x-1/2 landtop:-top-1.5 z-10">
              {/* <WheelSelector
                className=" shadow-dark drop-shadow-md"
                center={{
                  x: (wheelSize * 0.8) / 2,
                  y: (wheelSize * 0.8) / 2,
                }}
                size={wheelSize * 0.8}
                startAngle={260}
                endAngle={280}
              /> */}
            </div>
          </div>
        </Group>
      </Group>
    </Stack>
  )
}
