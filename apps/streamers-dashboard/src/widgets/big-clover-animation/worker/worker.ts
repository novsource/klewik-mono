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

const TINY_CLOVER_PATH_2D = new Path2D(
  'M11.774 6.743h-.567c-.903 0-1.657.64-1.834 1.49V7.006a1.215 1.215 0 0 1 2.4-.263zM9.4 8.616a1.215 1.215 0 0 0 2.375 0H9.4zm3.016-1.61a1.829 1.829 0 1 0-3.657 0v1.355a1.829 1.829 0 0 0 3.657 0V7.006zm-7.953 1.61a1.215 1.215 0 0 0 2.376 0H4.463zm-.027-.305V7.006a1.215 1.215 0 0 1 2.401-.263h-.552c-.93 0-1.703.679-1.849 1.568zM7.48 7.006a1.829 1.829 0 1 0-3.658 0v1.355a1.829 1.829 0 0 0 3.658 0V7.006zm7.03.917a4.25 4.25 0 1 1-6.011 6.012.345.345 0 0 0-.488 0A4.25 4.25 0 1 1 2 7.923a.345.345 0 0 0 0-.487A4.25 4.25 0 0 1 8.01 1.425a.345.345 0 0 0 .488 0 4.25 4.25 0 1 1 6.01 6.011.345.345 0 0 0 0 .487z',
)

const HDR_TINY_CLOVER_PATH_2D = new Path2D(
  'M7.04105 4.11764L6.70099 4.11764C6.15902 4.11764 5.70662 4.50121 5.60045 5.01167L5.60045 4.27548C5.60045 3.87294 5.92677 3.54662 6.32932 3.54662C6.67766 3.54662 6.96893 3.79098 7.04105 4.11764ZM5.61663 5.24175C5.68708 5.57062 5.97941 5.8172 6.32932 5.8172C6.67924 5.8172 6.97156 5.57062 7.04202 5.24175L5.61663 5.24175ZM7.42666 4.27548C7.42666 3.66945 6.93537 3.17815 6.32932 3.17815C5.72328 3.17815 5.23199 3.66945 5.23199 4.27548L5.23199 5.08833C5.23199 5.69437 5.72328 6.18566 6.32932 6.18566C6.93537 6.18566 7.42666 5.69437 7.42666 5.08833L7.42666 4.27548ZM2.65481 5.24172C2.72526 5.57062 3.01759 5.8172 3.36751 5.8172C3.71743 5.8172 4.00977 5.57062 4.08022 5.24172L2.65481 5.24172ZM2.63864 5.0586L2.63864 4.27548C2.63864 3.87295 2.96496 3.54662 3.36751 3.54662C3.71585 3.54662 4.00711 3.79097 4.07924 4.11762L3.74792 4.11762C3.18944 4.11762 2.72609 4.52487 2.63864 5.0586ZM4.46485 4.27548C4.46485 3.66944 3.97356 3.17815 3.36751 3.17815C2.76147 3.17815 2.27017 3.66944 2.27017 4.27548L2.27017 5.08833C2.27017 5.69437 2.76147 6.18566 3.36751 6.18566C3.97356 6.18566 4.46485 5.69437 4.46485 5.08833L4.46485 4.27548ZM8.68269 4.82592C9.67868 5.82191 9.67869 7.4367 8.68269 8.43269C7.6867 9.42868 6.07188 9.42869 5.07588 8.4327C4.99514 8.35195 4.86421 8.35193 4.78347 8.43267C3.78747 9.42867 2.17266 9.42868 1.17666 8.43269C0.180697 7.4367 0.180697 5.82188 1.17666 4.82589C1.25741 4.74516 1.25741 4.61425 1.17666 4.5335C0.180697 3.53752 0.180697 1.9227 1.17666 0.926703C2.17266 -0.069318 3.78747 -0.0692258 4.78347 0.926722C4.86421 1.00746 4.99514 1.00745 5.07589 0.926695C6.07188 -0.0693173 7.6867 -0.0693176 8.68269 0.926704C9.67869 1.9227 9.67868 3.5375 8.68269 4.53347C8.60194 4.61423 8.60194 4.74517 8.68269 4.82592Z',
)

const SMALL_CLOVER_PATH_2D = new Path2D(
  'M93.3626 153.333L106.587 153.333C127.664 153.333 145.257 168.249 149.386 188.1L149.386 159.471C149.386 143.816 136.696 131.126 121.041 131.126C107.494 131.126 96.1672 140.629 93.3626 153.333ZM148.757 197.048C146.017 209.837 134.649 219.426 121.041 219.426C107.433 219.426 96.0651 209.837 93.325 197.048L148.757 197.048ZM78.3667 159.471C78.3667 135.903 97.4726 116.797 121.041 116.797C144.609 116.797 163.715 135.903 163.715 159.471L163.715 191.082C163.715 214.65 144.609 233.756 121.041 233.756C97.4726 233.756 78.3667 214.65 78.3667 191.082L78.3667 159.471ZM263.939 197.047C261.199 209.837 249.831 219.426 236.222 219.426C222.614 219.426 211.246 209.837 208.506 197.047L263.939 197.047ZM264.567 189.925L264.567 159.471C264.567 143.817 251.877 131.126 236.222 131.126C222.676 131.126 211.349 140.629 208.544 153.332L221.429 153.332C243.147 153.332 261.167 169.169 264.567 189.925ZM193.548 159.471C193.548 135.903 212.654 116.797 236.222 116.797C259.791 116.797 278.897 135.903 278.897 159.471L278.897 191.082C278.897 214.65 259.791 233.756 236.222 233.756C212.654 233.756 193.548 214.65 193.548 191.082L193.548 159.471ZM29.5209 180.877C-9.21195 219.61 -9.2122 282.407 29.521 321.14C68.2542 359.873 131.053 359.873 169.786 321.14C172.926 318 178.018 317.999 181.157 321.139C219.891 359.872 282.689 359.873 321.422 321.14C360.154 282.407 360.154 219.608 321.422 180.876C318.282 177.736 318.282 172.645 321.422 169.505C360.154 130.772 360.154 67.9735 321.422 29.2404C282.689 -9.49371 219.891 -9.49014 181.157 29.2412C178.017 32.381 172.926 32.3807 169.786 29.2401C131.053 -9.49369 68.2542 -9.49369 29.5209 29.2405C-9.21222 67.9736 -9.21196 130.771 29.5209 169.504C32.6614 172.644 32.6614 177.736 29.5209 180.877Z',
)

const BIG_CLOVER_PATH_2D = new Path2D(
  'M242.254 398.361L276.638 398.361C331.438 398.361 377.18 437.143 387.915 488.757L387.915 414.32C387.915 373.619 354.92 340.624 314.218 340.624C278.997 340.624 249.546 365.332 242.254 398.361ZM386.279 512.021C379.156 545.273 349.598 570.205 314.218 570.205C278.838 570.205 249.281 545.273 242.157 512.021L386.279 512.021ZM203.265 414.32C203.265 353.043 252.94 303.368 314.218 303.368C375.496 303.368 425.171 353.043 425.171 414.32L425.171 496.508C425.171 557.786 375.496 607.461 314.218 607.461C252.94 607.461 203.265 557.786 203.265 496.509L203.265 414.32ZM685.752 512.018C678.629 545.273 649.071 570.205 613.69 570.205C578.309 570.205 548.751 545.273 541.628 512.018L685.752 512.018ZM687.387 493.502L687.387 414.32C687.387 373.619 654.392 340.624 613.69 340.624C578.469 340.624 549.019 365.331 541.726 398.358L575.227 398.358C631.695 398.358 678.545 439.536 687.387 493.502ZM502.737 414.32C502.737 353.043 552.412 303.368 613.69 303.368C674.968 303.368 724.643 353.043 724.643 414.32L724.643 496.508C724.643 557.786 674.968 607.461 613.69 607.461C552.412 607.461 502.737 557.786 502.737 496.508L502.737 414.32ZM76.2661 469.976C-24.4395 570.681 -24.4401 733.954 76.2661 834.66C176.973 935.366 340.249 935.366 440.954 834.661C449.119 826.497 462.357 826.495 470.521 834.658C571.228 935.364 734.503 935.366 835.209 834.66C935.912 733.954 935.912 570.678 835.209 469.973C827.045 461.809 827.045 448.573 835.209 440.409C935.912 339.704 935.912 176.427 835.209 75.7215C734.503 -24.9874 571.227 -24.9781 470.521 75.7233C462.357 83.887 449.119 83.8861 440.954 75.7206C340.249 -24.9873 176.972 -24.9873 76.266 75.7215C-24.4402 176.428 -24.4395 339.702 76.2661 440.406C84.4313 448.572 84.4313 461.81 76.2661 469.976Z',
)

const BIG_CLOVER_SIZE = 910
const SMALL_CLOVER_SIZE = 350

let drawer: NullablePossible<CloverCanvasDrawer> = null

globalThis.onmessage = (
  event: MessageEvent<CloverCanvasDrawerInitProps & CloverCanvasDrawerResize>,
) => {
  if (event.data.event !== 'resize') {
    drawer = new CloverCanvasDrawer({ ...event.data })

    drawer.init()
  }

  if (event.data.event === 'resize' && drawer instanceof CloverCanvasDrawer) {
    drawer.resizeByWrapper({
      wrapperHeight: event.data.height,
      wrapperWidth: event.data.width,
    })
  }
}

class CloverCanvasDrawer {
  private canvas
  private pixelRatio
  private wrapperWidth
  private wrapperHeight
  private reqId: number = 0
  private initCloverArr: DOMMatrix[] = []
  private animationTimer: (status?: 'up' | 'down') => number
  private previousAnimationValue: number = 0

  constructor({
    canvas,
    devicePixelRatio,
    wrapper,
  }: CloverCanvasDrawerInitProps) {
    this.canvas = canvas
    this.wrapperWidth = wrapper.offsetWidth
    this.pixelRatio = devicePixelRatio
    this.wrapperHeight = wrapper.offsetHeight

    this.animationTimer = this._timerInit()
  }

  public resizeByWrapper({
    wrapperWidth,
    wrapperHeight,
  }: {
    wrapperWidth: number
    wrapperHeight: number
  }) {
    this.wrapperWidth = wrapperWidth
    this.wrapperHeight = wrapperHeight

    this.resize()
  }

  public init() {
    this.resize()
    this._initDraw()
  }

  private _initDraw = () => {
    const tinyCloverSize = this.pixelRatio === 1 ? 10 : 9
    const gapBetweenTinyClovers = this.pixelRatio === 1 ? 8 : 2

    const columnsCountBg = Math.floor(
      this.wrapperWidth / (tinyCloverSize + gapBetweenTinyClovers),
    )
    const rowsCountBg = Math.floor(
      this.wrapperHeight / (tinyCloverSize + gapBetweenTinyClovers),
    )

    const count
      = this.pixelRatio === 1
        ? Math.floor(
            BIG_CLOVER_SIZE / 2 / (tinyCloverSize + gapBetweenTinyClovers),
          )
        : Math.floor(
            (SMALL_CLOVER_SIZE * this.pixelRatio)
            / 2
            / (tinyCloverSize + gapBetweenTinyClovers),
          )

    const startCloverX = Math.floor(columnsCountBg / 2) - count
    const startCloverY = Math.floor(rowsCountBg / 2) - count

    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D

    const m = new DOMMatrix()

    m.e
      = (startCloverX * (tinyCloverSize + gapBetweenTinyClovers))
        / this.pixelRatio
    m.f
      = (startCloverY * (tinyCloverSize + gapBetweenTinyClovers))
        / this.pixelRatio

    const bigClover = new Path2D()

    bigClover.addPath(
      this.pixelRatio <= 1 ? BIG_CLOVER_PATH_2D : SMALL_CLOVER_PATH_2D,
      m,
    )

    for (let row = 0; row <= rowsCountBg; row++) {
      for (let column = startCloverX; column <= columnsCountBg; column++) {
        // Draw tiny clover for background
        const mat = new DOMMatrix()

        // f - двигает по y | e - двигает по x
        mat.e = column * (tinyCloverSize + gapBetweenTinyClovers)
        mat.f = row * (tinyCloverSize + gapBetweenTinyClovers)

        const isOutOfBoundsX
          = column > startCloverX + count * 2 * this.pixelRatio
        const isOutOfBoundsY = row > startCloverY + count * 2 * this.pixelRatio

        if (isOutOfBoundsX || isOutOfBoundsY)
          continue

        if (ctx.isPointInPath(bigClover, mat.e, mat.f)) {
          this.initCloverArr.push(mat)
        }
      }
    }
  }

  private _timerInit = () => {
    let startTimerValue = Date.now()
    let lastStatus: 'up' | 'down' = 'up'

    function convertMsToSeconds(ms: number) {
      return ms / 1000
    }

    return (status?: 'up' | 'down') => {
      // Init time again - when status is changed time will going from zero again but in another direction
      if (status && status !== lastStatus) {
        lastStatus = status

        startTimerValue = Date.now()
      }
      if (lastStatus === 'down') {
        return convertMsToSeconds(Date.now() - startTimerValue)
      }
      else {
        return convertMsToSeconds(startTimerValue - Date.now())
      }
    }
  }

  // First version of draw was with isPointInPath method, but it's was too slow. New draw method give a liiiitle more performance
  private draw = () => {
    const tinyCloverSize = this.pixelRatio <= 1 ? 10 : 8
    const gapBetweenTinyClovers = this.pixelRatio <= 1 ? 8 : 3

    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.fillStyle = '#74DFA2'

    let animationTime = this.animationTimer()

    if (animationTime <= -5) {
      animationTime = this.animationTimer('down')
    }
    else if (animationTime >= 6) {
      animationTime = this.animationTimer('up')
    }

    const timeChangeDirection
      = this.previousAnimationValue !== Math.floor(animationTime)
        ? this.previousAnimationValue > Math.floor(animationTime)
          ? -1
          : 1
        : false

    const timerAnimateValue = timeChangeDirection
      ? timeChangeDirection * (gapBetweenTinyClovers + tinyCloverSize)
      : 0

    if (this.previousAnimationValue === Math.floor(animationTime)) {
      this.reqId = requestAnimationFrame(this.draw)
      return
    }

    this.clearCanvas()

    this.initCloverArr.forEach((matrix, index) => {
      const newMatrix = new DOMMatrix()

      const clover = new Path2D()

      newMatrix.e = matrix.e
      newMatrix.f = matrix.f + timerAnimateValue

      const targetUpValue = matrix.f - (gapBetweenTinyClovers + tinyCloverSize)
      const targetDownValue
        = matrix.f + (gapBetweenTinyClovers + tinyCloverSize)

      const isUp = newMatrix.f <= targetUpValue
      const isDown = newMatrix.f >= targetDownValue

      if (isUp || isDown) {
        clover.addPath(
          this.pixelRatio <= 1 ? TINY_CLOVER_PATH_2D : HDR_TINY_CLOVER_PATH_2D,
          newMatrix,
        )

        newMatrix.f = isUp ? targetUpValue : targetDownValue

        ctx.fill(clover)

        this.initCloverArr[index] = newMatrix
        this.previousAnimationValue = Math.floor(animationTime)
      }
      else {
        clover.addPath(
          this.pixelRatio <= 1 ? TINY_CLOVER_PATH_2D : HDR_TINY_CLOVER_PATH_2D,
          matrix,
        )

        ctx.fillStyle = `rgba(111,207,151,0.${Math.abs((animationTime * 1000) % 1000)})`
        // ctx.fillStyle = '#BBB'
        ctx.fill(clover)
      }
    })

    this.reqId = requestAnimationFrame(this.draw)
  }

  resize = () => {
    cancelAnimationFrame(this.reqId)

    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D

    this.canvas.width = this.wrapperWidth * this.pixelRatio
    this.canvas.height = this.wrapperHeight * this.pixelRatio

    ctx.scale(this.pixelRatio, this.pixelRatio)

    this.draw()
  }

  clearCanvas = () => {
    const context = this.canvas.getContext('2d') as CanvasRenderingContext2D

    context.clearRect(0, 0, this.wrapperWidth, this.wrapperHeight)
  }
}
