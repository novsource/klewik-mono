export class CloverCanvas {
  public reqId: number = 0
  private offscreenWorker: NullablePossible<Worker> = null
  private canvasWorker: NullablePossible<OffscreenCanvas> = null

  constructor(
    private canvas: HTMLCanvasElement,
    private canvasWrapper: HTMLElement
  ) {}

  init() {
    const worker = new Worker(
      'src/pages/welcome/ui/CloverAnimation/worker/worker.ts'
    )
    this.canvasWorker = this.canvas.transferControlToOffscreen()

    this.offscreenWorker = worker

    worker.postMessage(
      {
        canvas: this.canvasWorker,
        size: { width: window.innerWidth, height: window.innerHeight },
        devicePixelRatio: window.devicePixelRatio,
        wrapper: {
          offsetWidth: this.canvasWrapper.offsetWidth,
          offsetHeight: this.canvasWrapper.offsetHeight,
        },
      },
      [this.canvasWorker]
    )
  }

  resize({ width, height }: { width: number; height: number }) {
    if (this.offscreenWorker) {
      this.offscreenWorker.postMessage({
        width,
        height,
        event: 'resize',
      })
    }
  }

  terminate() {
    this.offscreenWorker?.terminate()
  }

  closeReq() {
    if (this.reqId) {
      window.cancelAnimationFrame(this.reqId)
      this.reqId = 0
    }
  }
}
