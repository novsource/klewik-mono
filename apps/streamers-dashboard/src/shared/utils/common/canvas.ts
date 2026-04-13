import { getRandomHEXColor } from './colors'

/**
 * Returns the maximum canvas size depending on the size of its parent element
 * @param {HTMLElement} wrapper - Parent HTML element
 * @return {number} Maximum canvas size in pixels
 */
export const getMaxSizeCanvas = (wrapper: HTMLElement): number => {
  const wrapperWidth = wrapper.offsetWidth
  const wrapperHeight = wrapper.offsetHeight

  const rightWidgetMinWidth = 50
  const isMobile = window.innerWidth <= 1024
  const wrapperPosY = wrapper.getBoundingClientRect().y

  const generalMaxWidth = isMobile
    ? wrapperWidth
    : wrapperWidth - rightWidgetMinWidth

  const generalMaxHeight = isMobile
    ? window.innerHeight - 56 - wrapperPosY
    : window.innerHeight - wrapperPosY

  const targetSize = Math.min(generalMaxWidth, wrapperHeight, generalMaxHeight)

  return targetSize
}

/**
 * Returns the coordinates of the center point of the transmitted
 * canvas element
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @return {x: number, y: number} Returns the center of the canvas as points {x;y}
 */

export const getCenterCanvas = (
  canvas: HTMLCanvasElement,
): { x: number, y: number } => {
  return { x: canvas.width / 2, y: canvas.height / 2 }
}

/**
 * Correctly resizes the canvas depending on the pixel ratio
 * @param {ResizeCanvasProperties} {canvas, wheelSelector, wrapper}
 */

export const resizeCanvasWithRatio = (
  canvas: HTMLCanvasElement,
  wrapper?: HTMLElement,
) => {
  const size = wrapper
    ? wrapper.getBoundingClientRect().width
    : window.innerWidth
  const ratio = window.devicePixelRatio || 1

  canvas.width = canvas.height = Math.floor(size * ratio)

  canvas.style.width = `${size}px`
  canvas.style.height = `${size}px`
}

type DrawSliceProperties = {
  context: CanvasRenderingContext2D
  sliceData: {
    x: number
    y: number
    radius: number
    startAngle: number
    endAngle: number
    color?: string
  }
}

/**
 * Draws a piece of a wheel
 * @param {DrawSliceProperties} properties
 */
export const drawSlice = ({
  context,
  sliceData,
}: DrawSliceProperties) => {
  const { x, y, radius, startAngle, endAngle, color } = sliceData

  const sliceHeight = radius * 0.92

  context.strokeStyle = '#1F1F22'
  context.lineWidth = 1

  context.globalCompositeOperation = 'source-over'

  context.save()

  context.fillStyle = color ?? getRandomHEXColor()

  // Draw slice
  context.beginPath()
  context.moveTo(x, y)
  context.arc(x, y, radius - context.lineWidth, startAngle, endAngle)
  context.moveTo(x, y)
  context.closePath()

  context.fill()
  context.stroke()

  context.beginPath()
  context.arc(x, y, sliceHeight, 0, 2 * Math.PI)
  context.closePath()

  context.fillStyle = '#151515'
  context.fill()

  // Draw text
  // const angle = convertRadiansToDegrees(endAngle - startAngle)
  // const arcLength = getArcLength(angle, radius)

  // // TODO: Fix angle of text
  // if (options?.text && !options?.disableText && false) {
  //   const metrics = context.measureText(options.text)
  //   const textHeight
  //     = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent

  //   if (textHeight < arcLength * 0.125) {
  //     drawTextOnSlice(context, options?.text ?? 'untitled', {
  //       x,
  //       y,
  //       angle: (endAngle + startAngle) / 2,
  //     })
  //   }
  // }

  // if (onDraw !== undefined) {
  //   onDraw(slice)
  // }

  context.restore()
}

/**
 * Draws and compresses text on a slice
 */

export const drawTextOnSlice = (
  context: CanvasRenderingContext2D,
  text: string,
  slice: { x: number, y: number, angle: number },
) => {
  context.fillStyle = 'white'
  context.textAlign = 'center'
  const radius = slice.x

  const fitText = fitTextEllipsis(context, text, radius * 0.25)
  setFontSizeForCanvasText(context, radius, fitText)

  const metrics = context.measureText(text)
  const textHeight
    = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent

  context.translate(slice.x, slice.y)
  context.rotate(slice.angle)
  context.fillText(fitText, slice.x * 0.65, textHeight / 2 - context.lineWidth)
}

/**
 * Fit the text depending on the specified size
 */

const fitText = ({
  context,
  text,
  maxWidth,
  separator,
}: {
  context: CanvasRenderingContext2D
  text: string
  maxWidth: number
  separator: string
}) => {
  let result = ''

  if (context.measureText(text).width <= maxWidth) {
    return text
  }

  for (let charIndex = 0; charIndex < text.length - 1; charIndex++) {
    const metrics = context.measureText(result + separator)

    if (metrics.width > maxWidth) {
      return [...result, ...separator].join('')
    }

    result += text[charIndex]
  }

  return text
}

export const wrapText = ({
  context,
  text,
  maxWidth,
  separator = '-',
}: {
  context: CanvasRenderingContext2D
  text: string
  maxWidth: number
  separator: string
}) => {
  const result = []

  let str = ''

  for (let charIndex = 0; charIndex <= text.length - 1; charIndex++) {
    const metrics = context.measureText(`${str + separator}\n`)

    if (metrics.width >= maxWidth) {
      result.push(`${str + separator}\n`)
      text = text.slice(charIndex, text.length)
      charIndex = 0
      str = separator
    }

    str += text[charIndex]
  }

  if (str.length !== 0)
    result.push(str)

  return result
}

/**
 * Fit the text depending on the specified size and uses a colon at the end
 */

export function fitTextEllipsis(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  return fitText({ context, text, maxWidth, separator: '...' })
}

/**
 * Cleans the canvas of everything so that it is rendered on it
 * @param {HTMLCanvasElement} canvas - Canvas element
 */

export function clearCanvas(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d') as CanvasRenderingContext2D

  context.clearRect(0, 0, canvas.width, canvas.height)
}

/**
 * Sets the correct font size on the canvas according to the wheel size
 */

export function setFontSizeForCanvasText(
  context: CanvasRenderingContext2D,
  radius: number,
  text: string,
) {
  const defaultFontSizeRem = 30

  for (let i = defaultFontSizeRem; i > 20; i -= 0.15) {
    context.font = `${i}px sans-serif`

    const measureText = context.measureText(text)

    if (measureText.width < radius * 0.2)
      return
  }
}

export function convertDegreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180)
}

export function convertRadiansToDegrees(radians: number) {
  return radians * (180 / Math.PI)
}

export function getDegreeByArcLength(radius: number, arcLength: number) {
  return (180 * arcLength) / (Math.PI * radius)
}

export function getMaxCircleLength(radius: number) {
  return radius * 2 * Math.PI
}

export function getArcLength(angle: number, radius: number) {
  return (angle * Math.PI * radius) / 180
}

type GetPercentValueOptions = {
  asPercents?: boolean
}

export function getPercentValue(numTarget: number, num: number, options?: GetPercentValueOptions) {
  const basePercent = num / numTarget

  if (options?.asPercents) {
    return basePercent * 100
  }

  return basePercent
}

export function getCoordsOfDotByVectorAngle(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number,
) {
  const x = centerX + radius * Math.cos(angle)
  const y = centerY + radius * Math.sin(angle)

  return { x, y }
}

export function getAngleByCoords(x: number, y: number) {
  const angleInRadians = Math.atan2(y, x)

  let angleInDegrees = angleInRadians * (180 / Math.PI)

  if (angleInDegrees < 0) {
    angleInDegrees += 360
  }

  return angleInDegrees
}

type ResizeCanvasWithSizeOptions = {
  ratio?: 1 | 2 | 3
  scale?: boolean
}

export const resizeCanvasWithSize = (canvas: HTMLCanvasElement, width: number, height: number, options?: ResizeCanvasWithSizeOptions) => {
  const ratio = options?.ratio ?? (window.devicePixelRatio || 1)

  canvas.width = width * ratio
  canvas.height = height * ratio

  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  if (options?.scale) {
    const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D
    canvasContext.scale(ratio, ratio)
  }
}
