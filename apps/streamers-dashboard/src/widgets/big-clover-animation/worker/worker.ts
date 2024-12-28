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
  'M11.774 6.743h-.567c-.903 0-1.657.64-1.834 1.49V7.006a1.215 1.215 0 0 1 2.4-.263zM9.4 8.616a1.215 1.215 0 0 0 2.375 0H9.4zm3.016-1.61a1.829 1.829 0 1 0-3.657 0v1.355a1.829 1.829 0 0 0 3.657 0V7.006zm-7.953 1.61a1.215 1.215 0 0 0 2.376 0H4.463zm-.027-.305V7.006a1.215 1.215 0 0 1 2.401-.263h-.552c-.93 0-1.703.679-1.849 1.568zM7.48 7.006a1.829 1.829 0 1 0-3.658 0v1.355a1.829 1.829 0 0 0 3.658 0V7.006zm7.03.917a4.25 4.25 0 1 1-6.011 6.012.345.345 0 0 0-.488 0A4.25 4.25 0 1 1 2 7.923a.345.345 0 0 0 0-.487A4.25 4.25 0 0 1 8.01 1.425a.345.345 0 0 0 .488 0 4.25 4.25 0 1 1 6.01 6.011.345.345 0 0 0 0 .487z'
)

const HDR_TINY_CLOVER_PATH_2D = new Path2D(
  'M7.04105 4.11764L6.70099 4.11764C6.15902 4.11764 5.70662 4.50121 5.60045 5.01167L5.60045 4.27548C5.60045 3.87294 5.92677 3.54662 6.32932 3.54662C6.67766 3.54662 6.96893 3.79098 7.04105 4.11764ZM5.61663 5.24175C5.68708 5.57062 5.97941 5.8172 6.32932 5.8172C6.67924 5.8172 6.97156 5.57062 7.04202 5.24175L5.61663 5.24175ZM7.42666 4.27548C7.42666 3.66945 6.93537 3.17815 6.32932 3.17815C5.72328 3.17815 5.23199 3.66945 5.23199 4.27548L5.23199 5.08833C5.23199 5.69437 5.72328 6.18566 6.32932 6.18566C6.93537 6.18566 7.42666 5.69437 7.42666 5.08833L7.42666 4.27548ZM2.65481 5.24172C2.72526 5.57062 3.01759 5.8172 3.36751 5.8172C3.71743 5.8172 4.00977 5.57062 4.08022 5.24172L2.65481 5.24172ZM2.63864 5.0586L2.63864 4.27548C2.63864 3.87295 2.96496 3.54662 3.36751 3.54662C3.71585 3.54662 4.00711 3.79097 4.07924 4.11762L3.74792 4.11762C3.18944 4.11762 2.72609 4.52487 2.63864 5.0586ZM4.46485 4.27548C4.46485 3.66944 3.97356 3.17815 3.36751 3.17815C2.76147 3.17815 2.27017 3.66944 2.27017 4.27548L2.27017 5.08833C2.27017 5.69437 2.76147 6.18566 3.36751 6.18566C3.97356 6.18566 4.46485 5.69437 4.46485 5.08833L4.46485 4.27548ZM8.68269 4.82592C9.67868 5.82191 9.67869 7.4367 8.68269 8.43269C7.6867 9.42868 6.07188 9.42869 5.07588 8.4327C4.99514 8.35195 4.86421 8.35193 4.78347 8.43267C3.78747 9.42867 2.17266 9.42868 1.17666 8.43269C0.180697 7.4367 0.180697 5.82188 1.17666 4.82589C1.25741 4.74516 1.25741 4.61425 1.17666 4.5335C0.180697 3.53752 0.180697 1.9227 1.17666 0.926703C2.17266 -0.069318 3.78747 -0.0692258 4.78347 0.926722C4.86421 1.00746 4.99514 1.00745 5.07589 0.926695C6.07188 -0.0693173 7.6867 -0.0693176 8.68269 0.926704C9.67869 1.9227 9.67868 3.5375 8.68269 4.53347C8.60194 4.61423 8.60194 4.74517 8.68269 4.82592Z'
)

const SMALL_CLOVER_PATH_2D = new Path2D(
  'M228.429 136.141h-11.713c-18.668 0-34.251 13.211-37.908 30.794v-25.358c0-13.865 11.24-25.105 25.106-25.105 11.998 0 22.031 8.417 24.515 19.669zm-49.064 38.719c2.427 11.328 12.496 19.821 24.549 19.821 12.052 0 22.121-8.493 24.548-19.821h-49.097zm62.346-33.283c0-20.874-16.922-37.796-37.797-37.796-20.875 0-37.797 16.922-37.797 37.796v27.999c0 20.874 16.922 37.797 37.797 37.797 20.875 0 37.797-16.923 37.797-37.797v-27.999zM77.347 174.859c2.427 11.329 12.496 19.822 24.549 19.822 12.053 0 22.122-8.493 24.549-19.822H77.347zm-.557-6.308v-26.974c0-13.865 11.24-25.105 25.106-25.105 11.998 0 22.031 8.417 24.515 19.668h-11.412c-19.237 0-35.197 14.027-38.209 32.411zm62.903-26.974c0-20.874-16.922-37.796-37.797-37.796-20.875 0-37.797 16.922-37.797 37.796v27.999c0 20.874 16.922 37.797 37.797 37.797 20.875 0 37.797-16.923 37.797-37.797v-27.999zm145.281 18.96c34.307 34.306 34.307 89.927 0 124.233-34.306 34.306-89.928 34.307-124.234 0a7.123 7.123 0 0 0-10.072 0c-34.307 34.306-89.928 34.306-124.235 0-34.305-34.306-34.305-89.928 0-124.234a7.12 7.12 0 0 0 0-10.071c-34.305-34.306-34.305-89.928 0-124.234 34.307-34.308 89.928-34.305 124.235 0a7.122 7.122 0 0 0 10.072 0c34.306-34.308 89.928-34.308 124.234 0 34.307 34.306 34.307 89.927 0 124.233a7.124 7.124 0 0 0 0 10.073z'
)

const BIG_CLOVER_PATH_2D = new Path2D(
  'M242.254 398.361L276.638 398.361C331.438 398.361 377.18 437.143 387.915 488.757L387.915 414.32C387.915 373.619 354.92 340.624 314.218 340.624C278.997 340.624 249.546 365.332 242.254 398.361ZM386.279 512.021C379.156 545.273 349.598 570.205 314.218 570.205C278.838 570.205 249.281 545.273 242.157 512.021L386.279 512.021ZM203.265 414.32C203.265 353.043 252.94 303.368 314.218 303.368C375.496 303.368 425.171 353.043 425.171 414.32L425.171 496.508C425.171 557.786 375.496 607.461 314.218 607.461C252.94 607.461 203.265 557.786 203.265 496.509L203.265 414.32ZM685.752 512.018C678.629 545.273 649.071 570.205 613.69 570.205C578.309 570.205 548.751 545.273 541.628 512.018L685.752 512.018ZM687.387 493.502L687.387 414.32C687.387 373.619 654.392 340.624 613.69 340.624C578.469 340.624 549.019 365.331 541.726 398.358L575.227 398.358C631.695 398.358 678.545 439.536 687.387 493.502ZM502.737 414.32C502.737 353.043 552.412 303.368 613.69 303.368C674.968 303.368 724.643 353.043 724.643 414.32L724.643 496.508C724.643 557.786 674.968 607.461 613.69 607.461C552.412 607.461 502.737 557.786 502.737 496.508L502.737 414.32ZM76.2661 469.976C-24.4395 570.681 -24.4401 733.954 76.2661 834.66C176.973 935.366 340.249 935.366 440.954 834.661C449.119 826.497 462.357 826.495 470.521 834.658C571.228 935.364 734.503 935.366 835.209 834.66C935.912 733.954 935.912 570.678 835.209 469.973C827.045 461.809 827.045 448.573 835.209 440.409C935.912 339.704 935.912 176.427 835.209 75.7215C734.503 -24.9874 571.227 -24.9781 470.521 75.7233C462.357 83.887 449.119 83.8861 440.954 75.7206C340.249 -24.9873 176.972 -24.9873 76.266 75.7215C-24.4402 176.428 -24.4395 339.702 76.2661 440.406C84.4313 448.572 84.4313 461.81 76.2661 469.976Z'
)

const TEST = new Path2D(
  'M88.175 52.9812L83.6409 52.9812C76.4145 52.9812 70.3826 58.0953 68.967 64.9016L68.967 55.0857C68.967 49.7184 73.3179 45.3675 78.6852 45.3675C83.3298 45.3675 87.2134 48.6257 88.175 52.9812ZM69.1826 67.9693C70.122 72.3543 74.0197 75.6419 78.6852 75.6419C83.3508 75.6419 87.2484 72.3543 88.1879 67.9693L69.1826 67.9693ZM93.3164 55.0857C93.3164 47.0052 86.7658 40.4547 78.6852 40.4547C70.6047 40.4547 64.0541 47.0052 64.0541 55.0857L64.0541 65.9237C64.0541 74.0042 70.6047 80.5548 78.6852 80.5548C86.7658 80.5548 93.3164 74.0042 93.3164 65.9237L93.3164 55.0857ZM29.6917 67.9689C30.631 72.3541 34.5288 75.6419 39.1944 75.6419C43.8601 75.6419 47.7578 72.3541 48.6972 67.9689L29.6917 67.9689ZM29.4761 65.5272L29.4761 55.0857C29.4761 49.7186 33.8271 45.3675 39.1944 45.3675C43.8389 45.3675 47.7224 48.6256 48.6841 52.9808L44.2665 52.9808C36.8202 52.9808 30.6421 58.4109 29.4761 65.5272ZM53.8256 55.0857C53.8256 47.0052 47.275 40.4547 39.1944 40.4547C31.1139 40.4547 24.5633 47.0052 24.5633 55.0857L24.5633 65.9237C24.5633 74.0042 31.1138 80.5548 39.1944 80.5548C47.275 80.5548 53.8256 74.0042 53.8256 65.9237L53.8256 55.0857ZM110.064 62.4249C123.343 75.7047 123.343 97.2353 110.064 110.515C96.7835 123.795 75.2526 123.795 61.9727 110.515C60.8961 109.439 59.1504 109.438 58.0739 110.515C44.7939 123.795 23.2631 123.795 9.98307 110.515C-3.29644 97.2352 -3.29644 75.7043 9.98307 62.4245C11.0597 61.348 11.0597 59.6026 9.98307 58.5259C-3.29644 45.2462 -3.29643 23.7152 9.98308 10.4353C23.2631 -2.84497 44.7939 -2.84374 58.0739 10.4356C59.1504 11.5121 60.8961 11.512 61.9727 10.4352C75.2526 -2.84496 96.7836 -2.84496 110.064 10.4353C123.343 23.7152 123.343 45.2459 110.064 58.5256C108.987 59.6024 108.987 61.3481 110.064 62.4249Z'
)

const SUPER_TEST = new Path2D(
  'M294.514 175.495L279.401 175.495C255.313 175.495 235.206 192.543 230.488 215.23L230.488 182.511C230.488 164.62 244.991 150.116 262.882 150.116C278.364 150.116 291.309 160.977 294.514 175.495ZM231.206 225.456C234.338 240.072 247.33 251.031 262.882 251.031C278.433 251.031 291.426 240.072 294.557 225.456L231.206 225.456ZM311.652 182.511C311.652 155.575 289.817 133.74 262.882 133.74C235.947 133.74 214.111 155.575 214.111 182.511L214.111 218.637C214.111 245.572 235.947 267.407 262.882 267.407C289.817 267.407 311.652 245.572 311.652 218.637L311.652 182.511ZM99.57 225.455C102.701 240.072 115.694 251.031 131.246 251.031C146.798 251.031 159.79 240.072 162.922 225.455L99.57 225.455ZM98.8515 217.316L98.8515 182.511C98.8515 164.62 113.355 150.116 131.246 150.116C146.727 150.116 159.672 160.977 162.878 175.494L148.153 175.494C123.332 175.494 102.738 193.594 98.8515 217.316ZM180.016 182.511C180.016 155.575 158.181 133.74 131.246 133.74C104.31 133.74 82.4752 155.575 82.4752 182.511L82.4752 218.637C82.4752 245.572 104.31 267.407 131.246 267.407C158.181 267.407 180.016 245.572 180.016 218.637L180.016 182.511ZM367.476 206.974C411.742 251.24 411.743 323.009 367.476 367.275C323.209 411.541 251.44 411.542 207.173 367.276C203.585 363.687 197.766 363.686 194.177 367.274C149.911 411.541 78.1412 411.541 33.8746 367.275C-10.3905 323.009 -10.3905 251.239 33.8746 206.973C37.4634 203.385 37.4634 197.567 33.8746 193.978C-10.3905 149.712 -10.3904 77.9422 33.8746 33.6758C78.1413 -10.5918 149.911 -10.5877 194.177 33.6766C197.766 37.2651 203.585 37.2647 207.173 33.6754C251.44 -10.5918 323.209 -10.5918 367.476 33.6758C411.743 77.9422 411.742 149.711 367.476 193.977C363.887 197.566 363.887 203.385 367.476 206.974Z'
)

const TEST_SIZE = 120
const SUPER_TEST_SIZE = 400

const BIG_CLOVER_SIZE = 950
const SMALL_CLOVER_SIZE = 450

let drawer: NullablePossible<CloverCanvasDrawer> = null

self.onmessage = (
  event: MessageEvent<CloverCanvasDrawerInitProps & CloverCanvasDrawerResize>
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
      this.wrapperWidth / (tinyCloverSize + gapBetweenTinyClovers)
    )
    const rowsCountBg = Math.floor(
      this.wrapperHeight / (tinyCloverSize + gapBetweenTinyClovers)
    )

    const count =
      this.pixelRatio === 1
        ? Math.floor(
            BIG_CLOVER_SIZE / 2 / (tinyCloverSize + gapBetweenTinyClovers)
          )
        : Math.floor(
            SMALL_CLOVER_SIZE / 2 / (tinyCloverSize + gapBetweenTinyClovers)
          )

    const startCloverX = Math.floor(columnsCountBg / 2) - count
    const startCloverY = Math.floor(rowsCountBg / 2) - count

    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D

    const m = new DOMMatrix()

    m.e =
      (startCloverX * (tinyCloverSize + gapBetweenTinyClovers)) /
      this.pixelRatio
    m.f =
      (startCloverY * (tinyCloverSize + gapBetweenTinyClovers)) /
      this.pixelRatio

    const bigClover = new Path2D()

    bigClover.addPath(
      this.pixelRatio <= 1 ? BIG_CLOVER_PATH_2D : SMALL_CLOVER_PATH_2D,
      m
    )

    for (let row = 0; row <= rowsCountBg; row++) {
      for (let column = startCloverX; column <= columnsCountBg; column++) {
        // Draw tiny clover for background
        const mat = new DOMMatrix()

        // f - двигает по y | e - двигает по x
        mat.e = column * (tinyCloverSize + gapBetweenTinyClovers)
        mat.f = row * (tinyCloverSize + gapBetweenTinyClovers)

        const isOutOfBoundsX =
          column > startCloverX + count * 2 * this.pixelRatio
        const isOutOfBoundsY = row > startCloverY + count * 2 * this.pixelRatio

        if (isOutOfBoundsX || isOutOfBoundsY) continue

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
      } else {
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
    } else if (animationTime >= 6) {
      animationTime = this.animationTimer('up')
    }

    const timeChangeDirection =
      this.previousAnimationValue !== Math.floor(animationTime)
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
      const targetDownValue =
        matrix.f + (gapBetweenTinyClovers + tinyCloverSize)

      const isUp = newMatrix.f <= targetUpValue
      const isDown = newMatrix.f >= targetDownValue

      if (isUp || isDown) {
        clover.addPath(
          this.pixelRatio <= 1 ? TINY_CLOVER_PATH_2D : HDR_TINY_CLOVER_PATH_2D,
          newMatrix
        )

        newMatrix.f = isUp ? targetUpValue : targetDownValue

        ctx.fill(clover)

        this.initCloverArr[index] = newMatrix
        this.previousAnimationValue = Math.floor(animationTime)
      } else {
        clover.addPath(
          this.pixelRatio <= 1 ? TINY_CLOVER_PATH_2D : HDR_TINY_CLOVER_PATH_2D,
          matrix
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
