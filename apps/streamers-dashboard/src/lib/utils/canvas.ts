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
  canvas: HTMLCanvasElement
): { x: number; y: number } => {
  return { x: canvas.width / 2, y: canvas.height / 2 }
}

/**
 * Correctly resizes the canvas depending on the pixel ratio
 * @param {ResizeCanvasProperties} {canvas, wheelSelector, wrapper}
 */

export const resizeCanvas: ResizeCanvas = ({
  canvas,
  wheelSelector,
  wrapper,
}) => {
  const size = wrapper.getBoundingClientRect().width
  const ratio = window.devicePixelRatio || 1

  canvas.width =
    canvas.height =
    wheelSelector.width =
    wheelSelector.height =
      Math.floor(size * ratio)

  canvas.style.width = wheelSelector.style.width = `${size}px`
  canvas.style.height = wheelSelector.style.height = `${size}px`
}

/**
 * Draws a piece of a wheel
 * @param {DrawSliceProperties} properties
 */

export const drawSlice: DrawSlice = ({
  context: ctx,
  options,
  onDraw,
  sliceParameters: { x, y, radius, startAngle, endAngle },
}) => {
  const slice = new Path2D()

  ctx.strokeStyle = 'white'
  ctx.lineWidth = 2

  ctx.save()

  ctx.fillStyle = options?.color ?? getRandomHSLColor()

  // Draw slice
  ctx.beginPath()

  ctx.moveTo(x, y)
  slice.moveTo(x, y)

  ctx.arc(x, y, radius - ctx.lineWidth, startAngle, endAngle)

  slice.arc(x, y, radius - ctx.lineWidth, startAngle, endAngle)

  ctx.closePath()

  slice.closePath()

  ctx.fill()

  ctx.moveTo(x, y)
  slice.moveTo(x, y)

  ctx.stroke()

  ctx.save()

  // Draw text
  const angle = convertRadiansToDegrees(endAngle - startAngle)
  const arcLength = getArcLength(angle, radius)

  if (options?.text) {
    const metrics = ctx.measureText(options.text)
    const textHeight =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent

    if (textHeight < arcLength * 0.125)
      drawTextOnSlice(ctx, options?.text ?? 'untitled', {
        x,
        y,
        angle: (endAngle + startAngle) / 2,
      })
  }

  if (onDraw !== undefined) {
    onDraw(slice)
  }

  ctx.restore()
}

/**
 * Draws and compresses text on a slice
 */

export const drawTextOnSlice = (
  ctx: CanvasRenderingContext2D,
  text: string,
  slice: { x: number; y: number; angle: number }
) => {
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  const radius = slice.x

  const fitText = fitTextEllipsis(ctx, text, radius * 0.25)
  setFontSizeForCanvasText(ctx, radius, fitText)

  const metrics = ctx.measureText(text)
  const textHeight =
    metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent

  ctx.translate(slice.x, slice.y)
  ctx.rotate(slice.angle)
  ctx.fillText(fitText, slice.x * 0.65, textHeight / 2 - ctx.lineWidth)
}

/**
 * Fit the text depending on the specified size
 */

const fitText = ({
  ctx,
  text,
  maxWidth,
  separator,
}: {
  ctx: CanvasRenderingContext2D
  text: string
  maxWidth: number
  separator: string
}) => {
  let result = ''

  if (ctx.measureText(text).width <= maxWidth) {
    return text
  }

  for (let charIndex = 0; charIndex < text.length - 1; charIndex++) {
    const metrics = ctx.measureText(result + separator)

    if (metrics.width > maxWidth) {
      return [...result, ...separator].join('')
    }

    result += text[charIndex]
  }

  return text
}

export const wrapText = ({
  ctx,
  text,
  maxWidth,
  separator = '-',
}: {
  ctx: CanvasRenderingContext2D
  text: string
  maxWidth: number
  separator: string
}) => {
  const result = []

  let str = ''

  for (let charIndex = 0; charIndex <= text.length - 1; charIndex++) {
    const metrics = ctx.measureText(str + separator + '\n')

    if (metrics.width >= maxWidth) {
      result.push(str + separator + '\n')
      text = text.slice(charIndex, text.length)
      charIndex = 0
      str = separator
    }

    str += text[charIndex]
  }

  if (str.length !== 0) result.push(str)

  return result
}

/**
 * Fit the text depending on the specified size and uses a colon at the end
 */

export const fitTextEllipsis = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) => {
  return fitText({ ctx, text, maxWidth, separator: '...' })
}

/**
 * Cleans the canvas of everything so that it is rendered on it
 * @param {HTMLCanvasElement} canvas - Canvas element
 */

export const clearCanvas = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('2d') as CanvasRenderingContext2D

  context.clearRect(0, 0, canvas.width, canvas.height)
}

/**
 * Sets the correct font size on the canvas according to the wheel size
 */

export const setFontSizeForCanvasText = (
  ctx: CanvasRenderingContext2D,
  radius: number,
  text: string
) => {
  const defaultFontSizeRem = 30

  for (let i = defaultFontSizeRem; i > 20; i -= 0.15) {
    ctx.font = `${i}px sans-serif`

    const measureText = ctx.measureText(text)

    if (measureText.width < radius * 0.2) return
  }
}

export const convertDegreesToRadians = (degrees: number) => {
  return degrees * (Math.PI / 180)
}

export const convertRadiansToDegrees = (radians: number) => {
  return radians * (180 / Math.PI)
}

export const getDegreeByArcLength = (radius: number, arcLength: number) => {
  return (180 * arcLength) / (Math.PI * radius)
}

export const getMaxCircleLength = (radius: number) => {
  return radius * 2 * Math.PI
}

export const getArcLength = (angle: number, radius: number) => {
  return (angle * Math.PI * radius) / 180
}

export const getPercentValue = (numTarget: number, num: number) => {
  return num / numTarget
}

export const getRandomRGBColor = () => {
  return `rgb(${Math.random() * 255},${Math.random() * 255},${
    Math.random() * 255
  })`
}

export const getRandomHSLColor = () => {
  return 'hsl(' + 360 * Math.random() + ',40%,48%)'
}
