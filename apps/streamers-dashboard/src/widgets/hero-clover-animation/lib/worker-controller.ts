type CloverCanvasOptions = {
  width?: number
  height?: number
}

export class HeroAnimationWorkerController {
  private _worker: NullablePossible<Worker> = null

  public rafId = 0
  public isAnimationStarted = false

  constructor(
    private _canvas: HTMLCanvasElement,
    private _options?: CloverCanvasOptions,
  ) {}

  init() {
    this._worker = new Worker(
      'src/widgets/hero-clover-animation/lib/worker.ts',
    )

    const offscreenCanvas = this._canvas.transferControlToOffscreen()

    this._worker.postMessage({
      event: 'initialization',
      payload: {
        devicePixelRatio: window.devicePixelRatio,
        canvas: offscreenCanvas,
        wrapper: {
          offsetWidth: this._options?.width ?? this._canvas.width,
          offsetHeight: this._options?.height ?? this._canvas.height,
        },
      },
    }, [offscreenCanvas])
  }

  resize(sizes: { width: number, height: number }) {
    this._worker?.postMessage({
      payload: sizes,
      event: 'resize',
    })
  }

  startAnimation() {
    this._worker?.postMessage({ event: 'startAnimation' })
    this.isAnimationStarted = true
  }

  endAnimation() {
    this._worker?.postMessage({ event: 'endAnimation' })
    this.isAnimationStarted = false
  }

  terminate() {
    // this._worker?.terminate()
  }

  closeReq() {
    if (!this.rafId)
      return

    window.cancelAnimationFrame(this.rafId)
    this.rafId = 0
  }
}
