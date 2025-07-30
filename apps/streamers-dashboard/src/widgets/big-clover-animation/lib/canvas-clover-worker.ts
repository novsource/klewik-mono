type CloverCanvasOptions = {
  width?: number
  height?: number
}

export class CloverCanvas {
  public reqId = 0

  private _worker: NullablePossible<Worker> = null

  constructor(
    private _canvas: HTMLCanvasElement,
    private _options?: CloverCanvasOptions,
  ) {}

  init() {
    const worker = new Worker(
      'src/widgets/big-clover-animation/lib/worker.ts',
    )

    const offscreenCanvas = this._canvas.transferControlToOffscreen()

    worker.postMessage({
      devicePixelRatio: window.devicePixelRatio,
      canvas: offscreenCanvas,
      wrapper: {
        offsetWidth: this._options?.width ?? this._canvas.width,
        offsetHeight: this._options?.height ?? this._canvas.height,
      },
    }, [offscreenCanvas])

    this._worker = worker
  }

  resize(sizes: { width: number, height: number }) {
    this._worker?.postMessage({
      ...sizes,
      event: 'resize',
    })
  }

  startAnimation() {
    this._worker?.postMessage({ event: 'startAnimation' })
  }

  endAnimation() {
    this._worker?.postMessage({ event: 'endAnimation' })
  }

  terminate() {
    this._worker?.terminate()
  }

  closeReq() {
    if (this.reqId) {
      window.cancelAnimationFrame(this.reqId)
      this.reqId = 0
    }
  }
}
