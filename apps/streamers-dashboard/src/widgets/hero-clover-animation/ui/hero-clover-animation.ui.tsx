import type { ComponentPropsWithoutRef } from 'react'
import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { useResizeObserver, useUnmount } from '~shared/hooks'

import { cn } from '~shared/utils'

import { BG_CLOVER_PATH_2D, BG_CLOVER_PATH_2D_HiDPI } from '../constants'
import { HeroAnimationWorkerController } from '../lib/worker-controller'

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
      <HeroAnimationCanvas width={width} height={height} />
      <HeroAnimationBackgroundCanvas width={width} height={height} />
    </div>
  )
})

type MainCloverCanvasProps = {
  width: number
  height: number
}

function HeroAnimationCanvas(props: MainCloverCanvasProps) {
  const { width, height } = props

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const workerControllerInstanceRef = useRef<NullablePossible<HeroAnimationWorkerController>>(null)

  useLayoutEffect(() => {
    const canvas = canvasRef.current

    if (!canvas || workerControllerInstanceRef.current)
      return

    workerControllerInstanceRef.current = new HeroAnimationWorkerController(canvas)
    workerControllerInstanceRef.current.init()

    workerControllerInstanceRef.current.startAnimation()
  }, [])

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const controller = workerControllerInstanceRef.current

    if (!controller || !canvas || controller.isAnimationStarted)
      return

    controller.startAnimation()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const controller = workerControllerInstanceRef.current

    if (!controller || !canvas)
      return

    controller.endAnimation()
    controller.resize({
      width,
      height,
    })
    controller.startAnimation()
  }, [width, height])

  useUnmount(() => {
    const controller = workerControllerInstanceRef.current

    if (!controller)
      return

    controller.endAnimation()
  })

  return <canvas ref={canvasRef} className="absolute left-0 top-0" />
}

type HeroAnimationBackgroundCanvasProps = ComponentPropsWithoutRef<'canvas'> & {
  width: number
  height: number
}

function HeroAnimationBackgroundCanvas(props: HeroAnimationBackgroundCanvasProps) {
  const { width, height, ...restProps } = props

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current)
      return

    resizeBackground(canvasRef.current, width, height)
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

function resizeBackground(canvas: HTMLCanvasElement, width: number, height: number) {
  const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D

  canvas.width = width * window.devicePixelRatio
  canvas.height = height * window.devicePixelRatio

  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  canvasContext.scale(
    window.devicePixelRatio,
    window.devicePixelRatio,
  )
}
