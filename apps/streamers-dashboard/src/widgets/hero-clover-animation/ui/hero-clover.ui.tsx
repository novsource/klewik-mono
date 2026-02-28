import { memo, useEffect, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

import { useResizeObserver } from '~shared/hooks'

import { resizeCanvasWithSize } from '~shared/utils/common'
import { cn } from '~shared/utils/react'

import { BG_CLOVER_PATH_2D, BG_CLOVER_PATH_2D_HiDPI } from '../constants'
import { CloverCanvasDrawer } from '../lib/hero-clover-drawer'

export type HeroCloverAnimationProps = ComponentPropsWithoutRef<'div'>

export const HeroCloverAnimation = memo((props: HeroCloverAnimationProps) => {
  const { className, ...restProps } = props

  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const { ref } = useResizeObserver<HTMLDivElement>({ onChange: (entry) => {
    const wrapper = entry[0].target

    setWidth(wrapper.clientWidth)
    setHeight(wrapper.clientHeight)
  } })

  return (
    <div
      ref={ref}
      className={cn('relative h-full w-full overflow-clip border-1 border-dark/50 rounded-large', className)}
      {...restProps}
    >
      <HeroCloversAnimationCanvas width={width} height={height} />
      <HeroBackgroundAnimationCanvas width={width} height={height} />
    </div>
  )
})

type MainCloverCanvasProps = {
  width: number
  height: number
}

function HeroCloversAnimationCanvas(props: MainCloverCanvasProps) {
  const { width, height } = props

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawerInstanceRef = useRef<NullablePossible<CloverCanvasDrawer>>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas)
      return

    if (!drawerInstanceRef.current) {
      drawerInstanceRef.current = new CloverCanvasDrawer({
        canvas,
        devicePixelRatio: 1,
        wrapper: canvas.parentElement || document.body,
        size: {
          width,
          height,
        },
      })

      drawerInstanceRef.current.startAnimation()
    }

    drawerInstanceRef.current.resize({ width, height })
  }, [width, height])

  return <canvas ref={canvasRef} className="absolute left-0 top-0" />
}

type HeroAnimationBackgroundCanvasProps = ComponentPropsWithoutRef<'canvas'> & {
  width: number
  height: number
}

function HeroBackgroundAnimationCanvas(props: HeroAnimationBackgroundCanvasProps) {
  const { width, height, ...restProps } = props

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current)
      return

    resizeCanvasWithSize(canvasRef.current, width, height, { scale: true })
    drawBackground(canvasRef.current, width, height)
  }, [width, height])

  return <canvas ref={canvasRef} {...restProps} />
}

function drawBackground(canvas: HTMLCanvasElement, width: number, height: number) {
  const pixelRatio = window.devicePixelRatio

  const bgCloverSize = pixelRatio === 1
    ? BG_CLOVER_PATH_2D.size
    : BG_CLOVER_PATH_2D_HiDPI.size

  const gapBetweenTinyClovers = pixelRatio === 1 ? 8 : 2

  const maxCountInRowBackground = Math.floor(width / (bgCloverSize + gapBetweenTinyClovers))
  const maxRowsCountBackground = Math.floor(height / (bgCloverSize + gapBetweenTinyClovers))

  const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D

  canvasContext.save()

  canvasContext.fillStyle = '#161617'

  for (let i = 0; i <= maxRowsCountBackground; i++) {
    for (let j = 0; j <= maxCountInRowBackground; j++) {
      // Draw tiny clover for background
      const matrix = new DOMMatrix()

      const translateXValue = j * (bgCloverSize + gapBetweenTinyClovers)
      const translateYValue = i * (bgCloverSize + gapBetweenTinyClovers)

      matrix.translateSelf(translateXValue, translateYValue)

      const clover = new Path2D()

      clover.addPath(
        pixelRatio <= 1
          ? BG_CLOVER_PATH_2D.path
          : BG_CLOVER_PATH_2D_HiDPI.path,
        matrix,
      )

      canvasContext.fill(clover)
    }
  }

  canvasContext.restore()
}
