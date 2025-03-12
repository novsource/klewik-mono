import { AuctionSlot } from '~entities/auction-slot/model'

type ResizeCanvasProperties = {
  canvas: HTMLCanvasElement
  wheelSelector: HTMLCanvasElement
  wrapper: HTMLDivElement
}

type ResizeCanvas = (property: ResizeCanvasProperties) => void

type DrawSliceOptions = {
  text?: string
  color?: AuctionSlot['color']
  textAngle?: number
  disableText?: boolean
}

type SliceParameters = {
  x: number
  y: number
  radius: number
  startAngle: number
  endAngle: number
}

type DrawSliceProperties = {
  context: CanvasRenderingContext2D
  sliceParameters: SliceParameters
  onDraw?(slice: Path2D): void
  options?: DrawSliceOptions
}

type DrawSlice = (properties: DrawSliceProperties) => void
