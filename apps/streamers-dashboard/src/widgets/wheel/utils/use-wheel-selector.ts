import { RefObject, useCallback, useRef } from 'react'

import { transform, useAnimationFrame } from 'framer-motion'

import { clearCanvas, resizeCanvasWithRatio } from '~shared/utils/canvas'

const HDR_TINY_CLOVER_PATH_2D = new Path2D(
  'M4.27501 6.75308L4.84177 6.75308C5.74506 6.75308 6.49905 7.39235 6.67601 8.24313L6.67601 7.01615C6.67601 6.34524 6.13213 5.80137 5.46122 5.80137C4.88066 5.80137 4.3952 6.20865 4.27501 6.75308ZM6.64905 8.62659C6.53163 9.17471 6.04441 9.58567 5.46122 9.58567C4.87803 9.58567 4.39083 9.17471 4.27339 8.62659L6.64905 8.62659ZM3.63232 7.01615C3.63232 6.00608 4.45115 5.18726 5.46122 5.18726C6.47129 5.18726 7.29011 6.00608 7.29011 7.01615L7.29012 8.3709C7.29012 9.38096 6.47129 10.1998 5.46122 10.1998C4.45115 10.1998 3.63232 9.38096 3.63232 8.3709L3.63232 7.01615ZM11.5854 8.62655C11.468 9.1747 10.9808 9.58567 10.3976 9.58567C9.81437 9.58567 9.32715 9.1747 9.20973 8.62655L11.5854 8.62655ZM11.6124 8.32134L11.6124 7.01615C11.6124 6.34525 11.0685 5.80137 10.3976 5.80137C9.81701 5.80137 9.33157 6.20863 9.21136 6.75304L9.76356 6.75303C10.6944 6.75303 11.4666 7.43179 11.6124 8.32134ZM8.56868 7.01615C8.56868 6.00608 9.3875 5.18726 10.3976 5.18726C11.4076 5.18726 12.2265 6.00608 12.2265 7.01615L12.2265 8.3709C12.2265 9.38096 11.4076 10.1998 10.3976 10.1998C9.3875 10.1998 8.56868 9.38096 8.56868 8.3709L8.56868 7.01615ZM1.53893 7.93355C-0.121046 9.59352 -0.121057 12.2848 1.53894 13.9448C3.19893 15.6048 5.8903 15.6048 7.55028 13.9448C7.68486 13.8103 7.90307 13.8102 8.03764 13.9448C9.69764 15.6048 12.389 15.6048 14.049 13.9448C15.7089 12.2848 15.7089 9.59347 14.049 7.9335C13.9144 7.79893 13.9144 7.58076 14.049 7.44618C15.7089 5.7862 15.7089 3.09484 14.049 1.43485C12.389 -0.225189 9.69764 -0.225036 8.03764 1.43488C7.90307 1.56944 7.68486 1.56943 7.55028 1.43483C5.8903 -0.225189 3.19893 -0.225189 1.53893 1.43485C-0.121058 3.09484 -0.121047 5.78617 1.53893 7.44613C1.67353 7.58073 1.67353 7.79895 1.53893 7.93355Z'
)

const HIDPI_CLOVER_PATH = new Path2D(
  'M8.82931 13.3163L9.96283 13.3163C11.7694 13.3163 13.2774 14.5949 13.6313 16.2964L13.6313 13.8425C13.6313 12.5007 12.5436 11.4129 11.2017 11.4129C10.0406 11.4129 9.0697 12.2275 8.82931 13.3163ZM13.5774 17.0634C13.3426 18.1596 12.3681 18.9815 11.2017 18.9815C10.0354 18.9815 9.06095 18.1596 8.82608 17.0634L13.5774 17.0634ZM7.54395 13.8425C7.54394 11.8223 9.18159 10.1847 11.2017 10.1847C13.2219 10.1847 14.8595 11.8223 14.8595 13.8425L14.8595 16.552C14.8595 18.5721 13.2219 20.2097 11.2017 20.2097C9.18159 20.2097 7.54395 18.5721 7.54395 16.552L7.54395 13.8425ZM23.4501 17.0633C23.2153 18.1596 22.2408 18.9815 21.0744 18.9815C19.908 18.9815 18.9336 18.1596 18.6988 17.0633L23.4501 17.0633ZM23.504 16.4529L23.504 13.8425C23.504 12.5007 22.4163 11.4129 21.0744 11.4129C19.9133 11.4129 18.9424 12.2274 18.702 13.3163L19.8064 13.3163C21.668 13.3163 23.2125 14.6738 23.504 16.4529ZM17.4166 13.8425C17.4166 11.8223 19.0543 10.1847 21.0744 10.1847C23.0946 10.1847 24.7322 11.8223 24.7322 13.8425L24.7322 16.552C24.7322 18.5721 23.0946 20.2097 21.0744 20.2097C19.0543 20.2097 17.4166 18.5721 17.4166 16.552L17.4166 13.8425ZM3.35717 15.6773C0.0372041 18.9972 0.0371827 24.3799 3.35717 27.6998C6.67716 31.0198 12.0599 31.0198 15.3799 27.6999C15.649 27.4307 16.0854 27.4306 16.3546 27.6998C19.6746 31.0197 25.0573 31.0198 28.3773 27.6998C31.6972 24.3799 31.6972 18.9971 28.3773 15.6772C28.1081 15.408 28.1081 14.9717 28.3773 14.7025C31.6972 11.3826 31.6972 5.99985 28.3773 2.67987C25.0573 -0.640198 19.6746 -0.639892 16.3546 2.67993C16.0854 2.94907 15.649 2.94904 15.3799 2.67984C12.0599 -0.640196 6.67716 -0.640197 3.35717 2.67987C0.0371811 5.99985 0.0372034 11.3825 3.35717 14.7024C3.62635 14.9716 3.62635 15.4081 3.35717 15.6773Z'
)

type WheelSelectorOptions = {
  gapBetweenClovers?: number
  bgCloverColor?: string
}

type BgElementItem = { path: Path2D; matrix: DOMMatrix; isFilled: boolean }

const tinyCloverSize = window.devicePixelRatio === 1 ? 15 : 30

const getBgCloversColor = transform([0, 1], ['#161616', '#212121'])

const useWheelSelector = (
  canvasRef: RefObject<HTMLCanvasElement>,
  wrapperRef?: RefObject<HTMLElement>,
  options?: WheelSelectorOptions
) => {
  const bgElementsArr = useRef<Array<BgElementItem>>([])
  const selectorCloversArr = useRef<Array<{ path: Path2D; matrix: DOMMatrix }>>(
    []
  )
  const bgColumnsCount = useRef(0)
  const bgRowsCount = useRef(0)

  // useAnimationFrame((t) => {
  //   if (!canvasRef.current) return

  //   if (Math.cos(t / 1000) <= 0) {
  //     console.log('appear')
  //   }

  //   if (Math.cos(t / 1000) >= 0) {
  //     console.log('dissapear')
  //   }
  // })

  // const drawSelector = useCallback(
  //   (time: number = 0) => {
  //     if (canvasRef.current) {
  //       const pixelRatio = window.devicePixelRatio
  //       const canvas = canvasRef.current
  //       const ctx = canvas.getContext('2d', {
  //         alpha: false,
  //       }) as CanvasRenderingContext2D

  //       const gapBetweenTinyClovers =
  //         options?.gapBetweenClovers ?? 5 * pixelRatio

  //       const selectorPath = new Path2D()
  //       const selectorMatrix = new DOMMatrix()

  //       const width = 120
  //       const height = 60

  //       // Count of clovers from middle to start of shape
  //       const halfWidthCount =
  //         pixelRatio === 1
  //           ? Math.floor(width / 2 / (tinyCloverSize + gapBetweenTinyClovers))
  //           : Math.floor(
  //               (width * pixelRatio) /
  //                 2 /
  //                 (tinyCloverSize + gapBetweenTinyClovers)
  //             )

  //       const halfHeightCount =
  //         pixelRatio === 1
  //           ? Math.floor(height / 2 / (tinyCloverSize + gapBetweenTinyClovers))
  //           : Math.floor(
  //               (height * pixelRatio) /
  //                 2 /
  //                 (tinyCloverSize + gapBetweenTinyClovers)
  //             )

  //       const startSelectorX =
  //         Math.ceil((bgColumnsCount.current / 2) * pixelRatio) -
  //         halfWidthCount * 1
  //       const startSelectorY =
  //         Math.ceil(
  //           bgRowsCount.current * 0.085 * Math.cos(time / 8500) * pixelRatio
  //         ) -
  //         halfHeightCount * 2

  //       selectorMatrix.e =
  //         (startSelectorX * (tinyCloverSize + gapBetweenTinyClovers)) /
  //         pixelRatio
  //       selectorMatrix.f =
  //         (startSelectorY * (tinyCloverSize + gapBetweenTinyClovers)) /
  //         pixelRatio

  //       selectorPath.addPath(
  //         new Path2D(
  //           'M0.114136 60.2013L60.1141 0.201294L120.114 60.2013H0.114136Z'
  //         ),
  //         selectorMatrix
  //       )

  //       bgElementsArr.current.forEach((clover) => {
  //         const cloverX = clover.matrix.e
  //         const cloverY = clover.matrix.f
  //         const isAlreadyFilled = clover.isFilled

  //         if (
  //           ctx.isPointInPath(selectorPath, cloverX, cloverY) &&
  //           !isAlreadyFilled
  //         ) {
  //           selectorCloversArr.current.push({
  //             path: clover.path,
  //             matrix: clover.matrix,
  //           })

  //           ctx.save()
  //           ctx.fillStyle = '#6FCF97'
  //           ctx.fill(clover.path)
  //           ctx.restore()

  //           clover.isFilled = true
  //         }
  //       })
  //     }
  //   },
  //   [canvasRef, bgElementsArr, bgRowsCount, bgColumnsCount, selectorCloversArr]
  // )

  const drawBackgroundWithClover = useCallback(
    (time: number = 0) => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const pixelRatio = window.devicePixelRatio

        const wrapper =
          wrapperRef?.current ?? (canvas.parentElement as HTMLDivElement)

        const gapBetweenTinyClovers =
          options?.gapBetweenClovers ?? 5 * pixelRatio

        const maxCountInRowBackground = Math.floor(
          (wrapper.offsetWidth * pixelRatio) /
            (tinyCloverSize + gapBetweenTinyClovers)
        )
        const maxRowsCountBackground = Math.floor(
          (wrapper.offsetHeight * pixelRatio) /
            (tinyCloverSize + gapBetweenTinyClovers)
        )

        bgColumnsCount.current = maxCountInRowBackground
        bgRowsCount.current = maxRowsCountBackground

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
              pixelRatio === 1 ? HDR_TINY_CLOVER_PATH_2D : HIDPI_CLOVER_PATH,
              mat
            )

            ctx.save()

            ctx.fillStyle = getBgCloversColor(Math.cos(time / 2500))
            ctx.fill(clover)

            ctx.restore()

            bgElementsArr.current.push({
              matrix: mat,
              path: clover,
              isFilled: false,
            })
          }
        }
      }
    },
    [canvasRef, wrapperRef]
  )

  const clearData = () => {
    bgElementsArr.current = []
    selectorCloversArr.current = []
  }

  const resizeBackground = useCallback(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current

      const wrapper =
        wrapperRef?.current ?? (canvas.parentElement as HTMLDivElement)

      clearData()
      clearCanvas(canvas)

      resizeCanvasWithRatio(canvas, wrapper)
      drawBackgroundWithClover()
    }

    window.removeEventListener('resize', resizeBackground)
    window.addEventListener('resize', resizeBackground)
  }, [drawBackgroundWithClover, wrapperRef, canvasRef])

  return {
    drawBackground: drawBackgroundWithClover,
    resizeBackground,
  }
}

export { useWheelSelector }
