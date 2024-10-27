import { useCallback, useEffect, useRef, useState } from 'react'
import { CloverCanvas } from './worker/CanvasCloverWorker'

const TINY_CLOVER_PATH_2D = new Path2D(
  'M11.774 6.743h-.567c-.903 0-1.657.64-1.834 1.49V7.006a1.215 1.215 0 0 1 2.4-.263zM9.4 8.616a1.215 1.215 0 0 0 2.375 0H9.4zm3.016-1.61a1.829 1.829 0 1 0-3.657 0v1.355a1.829 1.829 0 0 0 3.657 0V7.006zm-7.953 1.61a1.215 1.215 0 0 0 2.376 0H4.463zm-.027-.305V7.006a1.215 1.215 0 0 1 2.401-.263h-.552c-.93 0-1.703.679-1.849 1.568zM7.48 7.006a1.829 1.829 0 1 0-3.658 0v1.355a1.829 1.829 0 0 0 3.658 0V7.006zm7.03.917a4.25 4.25 0 1 1-6.011 6.012.345.345 0 0 0-.488 0A4.25 4.25 0 1 1 2 7.923a.345.345 0 0 0 0-.487A4.25 4.25 0 0 1 8.01 1.425a.345.345 0 0 0 .488 0 4.25 4.25 0 1 1 6.01 6.011.345.345 0 0 0 0 .487z'
)

const HDR_TINY_CLOVER_PATH_2D = new Path2D(
  'M7.04105 4.11764L6.70099 4.11764C6.15902 4.11764 5.70662 4.50121 5.60045 5.01167L5.60045 4.27548C5.60045 3.87294 5.92677 3.54662 6.32932 3.54662C6.67766 3.54662 6.96893 3.79098 7.04105 4.11764ZM5.61663 5.24175C5.68708 5.57062 5.97941 5.8172 6.32932 5.8172C6.67924 5.8172 6.97156 5.57062 7.04202 5.24175L5.61663 5.24175ZM7.42666 4.27548C7.42666 3.66945 6.93537 3.17815 6.32932 3.17815C5.72328 3.17815 5.23199 3.66945 5.23199 4.27548L5.23199 5.08833C5.23199 5.69437 5.72328 6.18566 6.32932 6.18566C6.93537 6.18566 7.42666 5.69437 7.42666 5.08833L7.42666 4.27548ZM2.65481 5.24172C2.72526 5.57062 3.01759 5.8172 3.36751 5.8172C3.71743 5.8172 4.00977 5.57062 4.08022 5.24172L2.65481 5.24172ZM2.63864 5.0586L2.63864 4.27548C2.63864 3.87295 2.96496 3.54662 3.36751 3.54662C3.71585 3.54662 4.00711 3.79097 4.07924 4.11762L3.74792 4.11762C3.18944 4.11762 2.72609 4.52487 2.63864 5.0586ZM4.46485 4.27548C4.46485 3.66944 3.97356 3.17815 3.36751 3.17815C2.76147 3.17815 2.27017 3.66944 2.27017 4.27548L2.27017 5.08833C2.27017 5.69437 2.76147 6.18566 3.36751 6.18566C3.97356 6.18566 4.46485 5.69437 4.46485 5.08833L4.46485 4.27548ZM8.68269 4.82592C9.67868 5.82191 9.67869 7.4367 8.68269 8.43269C7.6867 9.42868 6.07188 9.42869 5.07588 8.4327C4.99514 8.35195 4.86421 8.35193 4.78347 8.43267C3.78747 9.42867 2.17266 9.42868 1.17666 8.43269C0.180697 7.4367 0.180697 5.82188 1.17666 4.82589C1.25741 4.74516 1.25741 4.61425 1.17666 4.5335C0.180697 3.53752 0.180697 1.9227 1.17666 0.926703C2.17266 -0.069318 3.78747 -0.0692258 4.78347 0.926722C4.86421 1.00746 4.99514 1.00745 5.07589 0.926695C6.07188 -0.0693173 7.6867 -0.0693176 8.68269 0.926704C9.67869 1.9227 9.67868 3.5375 8.68269 4.53347C8.60194 4.61423 8.60194 4.74517 8.68269 4.82592Z'
)

const CloverAnimation = () => {
  const [cloverCanvas, setCloverCanvas] =
    useState<NullablePossible<CloverCanvas>>(null)
  const canvasRef = useRef<NullablePossible<HTMLCanvasElement>>(null)
  const backgroundCanvasRef = useRef<NullablePossible<HTMLCanvasElement>>(null)
  const canvasWrapperRef = useRef<NullablePossible<HTMLDivElement>>(null)

  useEffect(() => {
    if (
      canvasRef.current &&
      canvasWrapperRef.current &&
      backgroundCanvasRef.current
    ) {
      setCloverCanvas(
        new CloverCanvas(canvasRef.current, canvasWrapperRef.current)
      )
    }
  }, [])

  const drawBackground = useCallback(() => {
    if (canvasWrapperRef.current && backgroundCanvasRef.current) {
      const canvas = backgroundCanvasRef.current
      const pixelRatio = window.devicePixelRatio

      const tinyCloverSize = pixelRatio <= 1 ? 10 : 9
      const gapBetweenTinyClovers = pixelRatio <= 1 ? 8 : 2

      const maxCountInRowBackground = Math.floor(
        canvasWrapperRef.current.offsetWidth /
          (tinyCloverSize + gapBetweenTinyClovers)
      )
      const maxRowsCountBackground = Math.floor(
        canvasWrapperRef.current.offsetHeight /
          (tinyCloverSize + gapBetweenTinyClovers)
      )

      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

      for (let i = 0; i <= maxRowsCountBackground; i++) {
        for (let j = 0; j <= maxCountInRowBackground; j++) {
          // Draw tiny clover for background
          const mat = new DOMMatrix()

          // f - двигает по y | e - двигает по x
          mat.e = j * (tinyCloverSize + gapBetweenTinyClovers)
          mat.f = i * (tinyCloverSize + gapBetweenTinyClovers)

          const clover = new Path2D()

          clover.addPath(
            pixelRatio <= 1 ? TINY_CLOVER_PATH_2D : HDR_TINY_CLOVER_PATH_2D,
            mat
          )

          ctx.fillStyle = '#181818'
          ctx.fill(clover)
        }
      }
    }
  }, [])

  const resizeBackground = useCallback(() => {
    if (
      canvasRef.current &&
      canvasWrapperRef.current &&
      backgroundCanvasRef.current
    ) {
      const canvas = canvasRef.current
      const backgroundCanvas = backgroundCanvasRef.current
      const backgroundCanvasContext = backgroundCanvas.getContext(
        '2d'
      ) as CanvasRenderingContext2D

      const canvasWidth = canvasWrapperRef.current.offsetWidth
      const canvasHeight = canvasWrapperRef.current.offsetHeight

      canvas.style.width = canvasWidth + 'px'
      canvas.style.height = canvasHeight + 'px'

      backgroundCanvas.width =
        canvasWrapperRef.current.offsetWidth * window.devicePixelRatio
      backgroundCanvas.height =
        canvasWrapperRef.current.offsetHeight * window.devicePixelRatio

      backgroundCanvas.style.width = canvasWidth + 'px'
      backgroundCanvas.style.height = canvasHeight + 'px'

      backgroundCanvasContext.scale(
        window.devicePixelRatio,
        window.devicePixelRatio
      )

      drawBackground()
    }
  }, [drawBackground])

  const resizeCanvas = useCallback(() => {
    if (cloverCanvas && canvasWrapperRef.current) {
      cloverCanvas.resize({
        width: canvasWrapperRef.current.offsetWidth,
        height: canvasWrapperRef.current.offsetHeight,
      })
    }
  }, [cloverCanvas])

  useEffect(() => {
    if (cloverCanvas && canvasWrapperRef.current) {
      window.removeEventListener('resize', resizeBackground)

      resizeBackground()

      cloverCanvas.init()
      resizeCanvas()

      window.addEventListener('resize', () => {
        resizeBackground()
        resizeCanvas()
      })
    }

    return () => {
      if (cloverCanvas) {
        window.removeEventListener('resize', resizeBackground)
        cloverCanvas.terminate()
      }
    }
  }, [cloverCanvas, resizeBackground])

  return (
    <div ref={canvasWrapperRef} className="relative h-full w-full">
      <canvas ref={backgroundCanvasRef} />
      <canvas ref={canvasRef} className="absolute left-0 top-0" />
    </div>
  )
}

export default CloverAnimation
