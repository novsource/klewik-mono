type CloverCanvasDrawerInitProps = {
  canvas: HTMLCanvasElement
  wrapper: {
    offsetWidth: number
    offsetHeight: number
  }
  size?: {
    width: number
    height: number
  }

  devicePixelRatio: number
}

type CloverCanvasDrawerResize = {
  width: number
  height: number
  event: 'resize'
}

type BackgroundElement = {
  row: number
  column: number
  path: Path2D
  matrix: DOMMatrix
}

type BackgroundState = {
  rowsCount: number
  columnsCount: number
  elements: Map<`${number},${number}`, BackgroundElement>
}

type CloverBoxesState = {
  rowElementStart: number
  columnElementStart: number
  pseudoRow: number
  elements: BackgroundElement[]
}

const BG_CLOVER_PATH_2D = {
  size: 10,
  path: new Path2D(
    'M11.774 6.743h-.567c-.903 0-1.657.64-1.834 1.49V7.006a1.215 1.215 0 0 1 2.4-.263zM9.4 8.616a1.215 1.215 0 0 0 2.375 0H9.4zm3.016-1.61a1.829 1.829 0 1 0-3.657 0v1.355a1.829 1.829 0 0 0 3.657 0V7.006zm-7.953 1.61a1.215 1.215 0 0 0 2.376 0H4.463zm-.027-.305V7.006a1.215 1.215 0 0 1 2.401-.263h-.552c-.93 0-1.703.679-1.849 1.568zM7.48 7.006a1.829 1.829 0 1 0-3.658 0v1.355a1.829 1.829 0 0 0 3.658 0V7.006zm7.03.917a4.25 4.25 0 1 1-6.011 6.012.345.345 0 0 0-.488 0A4.25 4.25 0 1 1 2 7.923a.345.345 0 0 0 0-.487A4.25 4.25 0 0 1 8.01 1.425a.345.345 0 0 0 .488 0 4.25 4.25 0 1 1 6.01 6.011.345.345 0 0 0 0 .487z',
  ),
} as const

const BG_CLOVER_PATH_2D_HiDPI = {
  size: 9,
  path: new Path2D('M7.04105 4.11764L6.70099 4.11764C6.15902 4.11764 5.70662 4.50121 5.60045 5.01167L5.60045 4.27548C5.60045 3.87294 5.92677 3.54662 6.32932 3.54662C6.67766 3.54662 6.96893 3.79098 7.04105 4.11764ZM5.61663 5.24175C5.68708 5.57062 5.97941 5.8172 6.32932 5.8172C6.67924 5.8172 6.97156 5.57062 7.04202 5.24175L5.61663 5.24175ZM7.42666 4.27548C7.42666 3.66945 6.93537 3.17815 6.32932 3.17815C5.72328 3.17815 5.23199 3.66945 5.23199 4.27548L5.23199 5.08833C5.23199 5.69437 5.72328 6.18566 6.32932 6.18566C6.93537 6.18566 7.42666 5.69437 7.42666 5.08833L7.42666 4.27548ZM2.65481 5.24172C2.72526 5.57062 3.01759 5.8172 3.36751 5.8172C3.71743 5.8172 4.00977 5.57062 4.08022 5.24172L2.65481 5.24172ZM2.63864 5.0586L2.63864 4.27548C2.63864 3.87295 2.96496 3.54662 3.36751 3.54662C3.71585 3.54662 4.00711 3.79097 4.07924 4.11762L3.74792 4.11762C3.18944 4.11762 2.72609 4.52487 2.63864 5.0586ZM4.46485 4.27548C4.46485 3.66944 3.97356 3.17815 3.36751 3.17815C2.76147 3.17815 2.27017 3.66944 2.27017 4.27548L2.27017 5.08833C2.27017 5.69437 2.76147 6.18566 3.36751 6.18566C3.97356 6.18566 4.46485 5.69437 4.46485 5.08833L4.46485 4.27548ZM8.68269 4.82592C9.67868 5.82191 9.67869 7.4367 8.68269 8.43269C7.6867 9.42868 6.07188 9.42869 5.07588 8.4327C4.99514 8.35195 4.86421 8.35193 4.78347 8.43267C3.78747 9.42867 2.17266 9.42868 1.17666 8.43269C0.180697 7.4367 0.180697 5.82188 1.17666 4.82589C1.25741 4.74516 1.25741 4.61425 1.17666 4.5335C0.180697 3.53752 0.180697 1.9227 1.17666 0.926703C2.17266 -0.069318 3.78747 -0.0692258 4.78347 0.926722C4.86421 1.00746 4.99514 1.00745 5.07589 0.926695C6.07188 -0.0693173 7.6867 -0.0693176 8.68269 0.926704C9.67869 1.9227 9.67868 3.5375 8.68269 4.53347C8.60194 4.61423 8.60194 4.74517 8.68269 4.82592Z'),
} as const

const CLOVER_PATH_2D = {
  size: 460,
  path: new Path2D('M122.28 201.921L139.661 201.921C167.362 201.921 190.484 221.526 195.911 247.616L195.911 209.989C195.911 189.414 179.232 172.736 158.657 172.736C140.853 172.736 125.966 185.225 122.28 201.921ZM195.084 259.376C191.483 276.185 176.542 288.787 158.657 288.787C140.773 288.787 125.832 276.185 122.231 259.376L195.084 259.376ZM102.571 209.989C102.571 179.013 127.682 153.903 158.657 153.903C189.633 153.903 214.743 179.013 214.743 209.989L214.743 251.534C214.743 282.51 189.633 307.62 158.657 307.62C127.682 307.62 102.571 282.51 102.571 251.534L102.571 209.989ZM346.466 259.374C342.865 276.184 327.924 288.787 310.039 288.787C292.154 288.787 277.212 276.184 273.611 259.374L346.466 259.374ZM347.292 250.015L347.292 209.989C347.292 189.415 330.613 172.736 310.039 172.736C292.235 172.736 277.348 185.225 273.661 201.92L290.596 201.92C319.14 201.92 342.823 222.735 347.292 250.015ZM253.952 209.989C253.952 179.013 279.063 153.903 310.039 153.903C341.014 153.903 366.125 179.013 366.125 209.989L366.125 251.534C366.125 282.51 341.014 307.62 310.039 307.62C279.063 307.62 253.952 282.51 253.952 251.534L253.952 209.989ZM38.3738 238.122C-12.5323 289.028 -12.5327 371.562 38.3738 422.468C89.2804 473.374 171.816 473.375 222.722 422.469C226.849 418.342 233.541 418.341 237.667 422.467C288.574 473.374 371.109 473.374 422.016 422.468C472.92 371.562 472.92 289.027 422.016 238.121C417.888 233.994 417.888 227.303 422.016 223.176C472.92 172.27 472.92 89.7351 422.015 38.8288C371.109 -12.079 288.574 -12.0743 237.667 38.8297C233.541 42.9564 226.849 42.956 222.722 38.8284C171.816 -12.0789 89.2803 -12.079 38.3738 38.8288C-12.5327 89.7351 -12.5323 172.269 38.3738 223.175C42.5012 227.302 42.5012 233.995 38.3738 238.122Z',
  ),
} as const

const CLOVER_PATH_2D_HiDPI = {
  size: 170,
  path: new Path2D('M45.1187 74.3836L51.542 74.3836C61.7793 74.3836 70.3245 81.6287 72.33 91.2709L72.33 77.3651C72.33 69.7614 66.1661 63.5976 58.5624 63.5976C51.9827 63.5976 46.4809 68.2134 45.1187 74.3836ZM72.0245 95.6168C70.6937 101.829 65.1719 106.486 58.5624 106.486C51.953 106.486 46.4313 101.829 45.1004 95.6168L72.0245 95.6168ZM37.835 77.3651C37.835 65.9176 47.115 56.6377 58.5624 56.6377C70.0099 56.6377 79.2899 65.9176 79.2899 77.3651L79.2899 92.7189C79.2899 104.166 70.0099 113.446 58.5624 113.446C47.115 113.446 37.835 104.166 37.835 92.7189L37.835 77.3651ZM127.97 95.6163C126.639 101.829 121.117 106.486 114.508 106.486C107.898 106.486 102.376 101.829 101.046 95.6163L127.97 95.6163ZM128.275 92.1572L128.275 77.3651C128.275 69.7616 122.111 63.5976 114.508 63.5976C107.928 63.5976 102.426 68.2132 101.064 74.3831L107.322 74.3831C117.871 74.3831 126.624 82.0757 128.275 92.1572ZM93.7803 77.3651C93.7803 65.9176 103.06 56.6377 114.508 56.6377C125.955 56.6377 135.235 65.9176 135.235 77.3651L135.235 92.7189C135.235 104.166 125.955 113.446 114.508 113.446C103.06 113.446 93.7803 104.166 93.7803 92.7189L93.7803 77.3651ZM14.1099 87.7622C-4.70324 106.575 -4.70336 137.077 14.1099 155.89C32.9232 174.703 63.4253 174.703 82.2385 155.89C83.7638 154.365 86.2368 154.365 87.7619 155.89C106.575 174.703 137.077 174.703 155.891 155.89C174.703 137.077 174.703 106.575 155.891 87.7617C154.365 86.2366 154.365 83.764 155.891 82.2387C174.703 63.4257 174.703 32.9235 155.891 14.1103C137.077 -4.70343 106.575 -4.70169 87.7619 14.1107C86.2368 15.6357 83.7637 15.6356 82.2385 14.1101C63.4253 -4.70342 32.9232 -4.70342 14.1099 14.1103C-4.70337 32.9235 -4.70324 63.4253 14.1099 82.2382C15.6352 83.7636 15.6352 86.2368 14.1099 87.7622Z'),
} as const

let drawer: NullablePossible<CloverCanvasDrawer> = null

globalThis.onmessage = (
  message: MessageEvent<CloverCanvasDrawerInitProps & CloverCanvasDrawerResize>,
) => {
  switch (message.data.event) {
    case 'resize': {
      drawer?.resize({
        height: message.data.height,
        width: message.data.width,
      })
      break
    }
    case 'startAnimation': {
      drawer?.startAnimation()
      break
    }
    case 'endAnimation': {
      drawer?.endAnimation()
      break
    }
    default: {
      drawer = new CloverCanvasDrawer({ ...message.data })
    }
  }
}

class CloverCanvasDrawer {
  private _canvas
  private _pixelRatio
  private _wrapperWidth
  private _wrapperHeight
  private _reqId: number = 0
  private _animationTimer: (status?: 'up' | 'down') => number
  private _previousAnimationValue: number = -1
  private _backgroundState: BackgroundState = {
    rowsCount: 0,
    columnsCount: 0,
    elements: new Map(),
  }

  private _cloversBoxesCollection = new Map<`${number},${number}`, CloverBoxesState>()

  constructor({
    canvas,
    devicePixelRatio,
    wrapper,
  }: CloverCanvasDrawerInitProps) {
    this._canvas = canvas
    this._wrapperWidth = wrapper.offsetWidth
    this._pixelRatio = devicePixelRatio
    this._wrapperHeight = wrapper.offsetHeight

    this._animationTimer = this._timerInit()
  }

  resizeByWrapper({
    wrapperWidth,
    wrapperHeight,
  }: {
    wrapperWidth: number
    wrapperHeight: number
  }) {
    this._wrapperWidth = wrapperWidth
    this._wrapperHeight = wrapperHeight

    this.resize()
  }

  resize = (sizes?: { width: number, height: number }) => {
    const ctx = this._canvas.getContext('2d') as CanvasRenderingContext2D

    this._canvas.width = sizes?.width ?? this._wrapperWidth * this._pixelRatio
    this._canvas.height = sizes?.height ?? this._wrapperHeight * this._pixelRatio

    // ctx.scale(this._pixelRatio, this._pixelRatio)

    this._calculateBackgroundElements()
  }

  clearCanvas = () => {
    const context = this._canvas.getContext('2d') as CanvasRenderingContext2D

    context.clearRect(0, 0, this._canvas.width, this._canvas.height)
  }

  startAnimation = () => {
    this._calculateCloverBoxes()
    this._animateCloverBoxes()
  }

  endAnimation = () => {
    cancelAnimationFrame(this._reqId)

    this.clearCanvas()
  }

  private _timerInit = () => {
    const startTimerValue = Date.now()

    function convertMsToSeconds(ms: number) {
      return ms / 1000
    }

    return () => {
      return convertMsToSeconds(Date.now() - startTimerValue)
    }
  }

  private _calculateBackgroundElements = () => {
    const bgElementSize = this._getBgElementSize()
    const gapBetweenBgElements = this._getBgElementGap()

    const bgCloverPath
      = this._pixelRatio === 1
        ? BG_CLOVER_PATH_2D.path
        : BG_CLOVER_PATH_2D_HiDPI.path

    this._backgroundState.rowsCount = Math.floor(
      this._canvas.height / (bgElementSize + gapBetweenBgElements),
    )

    this._backgroundState.columnsCount = Math.floor(
      this._canvas.width / (bgElementSize + gapBetweenBgElements),
    )

    for (let row = 0; row <= this._backgroundState.rowsCount; row++) {
      for (let column = 0; column <= this._backgroundState.columnsCount; column++) {
        const matrix = new DOMMatrix()

        const translateXValue = column * (bgElementSize + gapBetweenBgElements)
        const translateYValue = row * (bgElementSize + gapBetweenBgElements)

        matrix.translateSelf(translateXValue, translateYValue)

        const bgElement: BackgroundElement = {
          row,
          column,
          matrix,
          path: bgCloverPath,
        }

        this._backgroundState.elements.set(`${column},${row}`, bgElement)
      }
    }
  }

  private _calculateCloverBoxes = () => {
    const bgElementSize = this._getBgElementSize()
    const gapBetweenBgElements = this._getBgElementGap()

    const cloverPathSize
      = this._pixelRatio === 1
        ? CLOVER_PATH_2D.size
        : CLOVER_PATH_2D_HiDPI.size

    const cloverBoxSize = Math.ceil(cloverPathSize / (bgElementSize + gapBetweenBgElements))

    const canvasContext = this._canvas.getContext('2d') as CanvasRenderingContext2D

    const fillRowCloverBoxes = (row: number, column: number, pseudoRow: number) => {
      // We take the first clover in the box
      const boxFirstClover = this._backgroundState.elements.get(`${column},${row}`)!

      const bigCloverMatrix = new DOMMatrix()
      bigCloverMatrix.translateSelf(boxFirstClover.matrix.e, boxFirstClover.matrix.f)

      // Add the clover we want to display in the box
      const bigCloverPath = new Path2D()
      bigCloverPath.addPath(
        this._pixelRatio === 1
          ? CLOVER_PATH_2D.path
          : CLOVER_PATH_2D_HiDPI.path,
        bigCloverMatrix,
      )

      const cloverBoxElements: BackgroundElement[] = []

      for (let i = row; i < row + cloverBoxSize; i++) {
        for (let j = column; j < column + cloverBoxSize; j++) {
          const bgElement = this._backgroundState.elements.get(`${j},${i}`)!

          // We check if the element from the background is included in the drawing we want to display
          const isPointInPath = canvasContext.isPointInPath(bigCloverPath, bgElement.matrix.e, bgElement.matrix.f)

          // If it does, then we display a painted background element in its place
          if (isPointInPath) {
            const cloverPath = new Path2D()

            cloverPath.addPath(
              this._pixelRatio <= 1
                ? BG_CLOVER_PATH_2D.path
                : BG_CLOVER_PATH_2D_HiDPI.path,
              bgElement.matrix,
            )

            cloverBoxElements.push({ row: i, column: j, matrix: bgElement.matrix, path: cloverPath })
          }
        }
      }

      this._cloversBoxesCollection.set(
        `${column},${row}`,
        { columnElementStart: column, rowElementStart: row, elements: cloverBoxElements, pseudoRow },
      )
    }

    const PADDING = 1

    const countOfRowBoxes = Math.floor(
      this._backgroundState.rowsCount / (cloverBoxSize + PADDING),
    )
    const countOfColumnBoxes = Math.floor(
      this._backgroundState.columnsCount / (cloverBoxSize + PADDING),
    )

    const startRow = Math.floor((this._backgroundState.rowsCount / countOfRowBoxes))
    const startColumn = Math.floor((this._backgroundState.columnsCount / countOfColumnBoxes))

    /*
      Two cycles go through all the boxes in which clovers are drawn
    */
    for (let row = 0; row < countOfRowBoxes; row++) {
      for (let column = 0; column < countOfColumnBoxes; column++) {
        const rowBgElementNumber = row === 0 ? PADDING : (row * startRow) + PADDING
        const columnBgElementNumber = column === 0 ? PADDING : (column * startColumn) + PADDING

        fillRowCloverBoxes(rowBgElementNumber, columnBgElementNumber, row)
      }
    }
  }

  private _animateCloverBoxes = () => {
    const animationTime = Math.ceil(this._animationTimer())

    if (this._previousAnimationValue === animationTime && this._previousAnimationValue !== -1) {
      this._reqId = requestAnimationFrame(this._animateCloverBoxes)
      return
    }

    this.clearCanvas()

    const canvasContext = this._canvas.getContext('2d') as CanvasRenderingContext2D

    canvasContext.fillStyle = '#5ec98c'
    canvasContext.save()

    Array.from(this._cloversBoxesCollection.values()).forEach((cloverBox) => {
      const movementDirection = cloverBox.pseudoRow % 2 === 0 ? 'forward' : 'backward'

      cloverBox.elements = cloverBox.elements.map((element) => {
        const path = new Path2D()
        const matrix = new DOMMatrix()

        const translateXValue = (this._getBgElementSize() + this._getBgElementGap()) * 2

        const matrixWithTranslate = movementDirection === 'forward'
          ? element.matrix.e + translateXValue
          : element.matrix.e - translateXValue

        const isCloverOutOfCanvas = movementDirection === 'forward'
          ? matrixWithTranslate >= this._canvas.width
          : matrixWithTranslate < 0

        if (isCloverOutOfCanvas) {
          const canvasWidth = this._canvas.width

          const newTranslateXValue = movementDirection === 'forward'
            ? matrixWithTranslate - (canvasWidth * Math.ceil((canvasWidth / (matrixWithTranslate))))
            : Math.ceil((canvasWidth - Math.abs(matrixWithTranslate)))

          matrix.f = element.matrix.f
          matrix.e = newTranslateXValue
        }
        else {
          matrix.f = element.matrix.f
          matrix.e = movementDirection === 'forward'
            ? translateXValue + element.matrix.e
            : element.matrix.e - translateXValue
        }

        path.addPath(
          this._pixelRatio === 1
            ? BG_CLOVER_PATH_2D.path
            : BG_CLOVER_PATH_2D_HiDPI.path,
          matrix,
        )

        canvasContext.fill(path)

        return { ...element, matrix }
      })
    })

    canvasContext.restore()

    this._previousAnimationValue = animationTime
    this._reqId = requestAnimationFrame(this._animateCloverBoxes)
  }

  private _getBgElementSize() {
    return this._pixelRatio === 1
      ? BG_CLOVER_PATH_2D.size
      : BG_CLOVER_PATH_2D_HiDPI.size
  }

  private _getBgElementGap() {
    return this._pixelRatio === 1 ? 8 : 2
  }
}
