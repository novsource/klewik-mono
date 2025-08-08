import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { useForcedRerender } from '~shared/hooks/use-forced-rerender'

import { BG_CLOVER_PATH_2D, BG_CLOVER_PATH_2D_HiDPI } from '../constants'
import { CloverCanvas } from '../lib/canvas-clover-worker'

type MainCloverCanvasProps = {
  width?: number
  height?: number
}

const MainCloverCanvas = memo((props: MainCloverCanvasProps) => {
  const { width, height } = props

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cloverCanvasInstanceRef = useRef<NullablePossible<CloverCanvas>>(null)

  const rerender = useForcedRerender()

  useEffect(() => {
    const cloverCanvas = cloverCanvasInstanceRef.current
    const canvas = canvasRef.current

    if (!cloverCanvas || !canvas)
      return

    cloverCanvas.resize({
      width: width ?? canvas.offsetWidth,
      height: height ?? canvas.offsetHeight,
    })
  }, [width, height])

  useLayoutEffect(() => {
    const canvas = canvasRef.current

    if (!canvas)
      return

    if (!cloverCanvasInstanceRef.current) {
      const instance = new CloverCanvas(canvas)

      instance.init()

      cloverCanvasInstanceRef.current = instance

      rerender()
    }
  }, [cloverCanvasInstanceRef, canvasRef, rerender])

  useLayoutEffect(() => {
    const cloverCanvas = cloverCanvasInstanceRef.current
    const canvas = canvasRef.current

    if (!cloverCanvas || !canvas)
      return

    const resizeCanvas = () => {
      cloverCanvas.resize({
        width: width ?? canvas.offsetWidth,
        height: height ?? canvas.offsetHeight,
      })
    }

    resizeCanvas()
    cloverCanvas.startAnimation()

    return () => {
      cloverCanvas.endAnimation()
    }
  }, [cloverCanvasInstanceRef, width, height])

  return <canvas ref={canvasRef} className="absolute left-0 top-0" />
})

export const CloverAnimation = memo(() => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null)
  const canvasWrapperRef = useRef<HTMLDivElement>(null)

  const drawBackground = useCallback(() => {
    if (canvasWrapperRef.current && backgroundCanvasRef.current) {
      const canvas = backgroundCanvasRef.current
      const pixelRatio = window.devicePixelRatio

      const bgCloverSize = pixelRatio === 1
        ? BG_CLOVER_PATH_2D.size
        : BG_CLOVER_PATH_2D_HiDPI.size

      const gapBetweenTinyClovers = pixelRatio === 1 ? 8 : 2

      const maxCountInRowBackground = Math.floor(
        canvasWrapperRef.current.offsetWidth
        / (bgCloverSize + gapBetweenTinyClovers),
      )
      const maxRowsCountBackground = Math.floor(
        canvasWrapperRef.current.offsetHeight
        / (bgCloverSize + gapBetweenTinyClovers),
      )

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
  }, [])

  const resizeBackground = useCallback(() => {
    if (canvasWrapperRef.current
      && backgroundCanvasRef.current
    ) {
      const backgroundCanvas = backgroundCanvasRef.current
      const backgroundCanvasContext = backgroundCanvas.getContext(
        '2d',
      ) as CanvasRenderingContext2D

      const canvasWidth = canvasWrapperRef.current.offsetWidth
      const canvasHeight = canvasWrapperRef.current.offsetHeight

      backgroundCanvas.width
        = canvasWrapperRef.current.offsetWidth * window.devicePixelRatio
      backgroundCanvas.height
        = canvasWrapperRef.current.offsetHeight * window.devicePixelRatio

      backgroundCanvas.style.width = `${canvasWidth}px`
      backgroundCanvas.style.height = `${canvasHeight}px`

      backgroundCanvasContext.scale(
        window.devicePixelRatio,
        window.devicePixelRatio,
      )

      drawBackground()

      setWidth(canvasWidth)
      setHeight(canvasHeight)
    }
  }, [drawBackground])

  useEffect(() => {
    resizeBackground()
  }, [resizeBackground])

  // useResizeObserver(canvasWrapperRef, resizeBackground)

  return (
    <div ref={canvasWrapperRef} className="relative h-full w-full border-1 border-dark rounded-[32px] overflow-clip">
      <canvas ref={backgroundCanvasRef} />
      <MainCloverCanvas width={width} height={height} />
    </div>
  )
})
