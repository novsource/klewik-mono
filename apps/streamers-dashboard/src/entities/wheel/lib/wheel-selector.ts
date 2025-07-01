export const getSelectorPath2D = (selectorCanvas: HTMLCanvasElement) => {
  const ctx = selectorCanvas.getContext('2d') as CanvasRenderingContext2D

  const center = selectorCanvas.width / 2
  const radius = selectorCanvas.width / 2

  ctx.save()

  const selectorPath = new Path2D()

  const selectorWidth = Math.max(55, selectorCanvas.clientWidth * 0.045)
  const selectorHeight = Math.max(25, selectorCanvas.clientHeight * 0.03)

  const selectorX = center
  const selectorY = radius * 0.1 + selectorHeight

  const strokeGradient = ctx.createLinearGradient(
    selectorX,
    selectorY - selectorHeight,
    selectorX,
    selectorY,
  )

  strokeGradient.addColorStop(0.075, '#6FCF97')
  strokeGradient.addColorStop(0.925, '#6FCF97')

  ctx.strokeStyle = strokeGradient
  ctx.fillStyle = '#3E4145'
  ctx.lineWidth = 4

  selectorPath.moveTo(selectorX, selectorY)

  selectorPath.arcTo(
    selectorX - selectorWidth / 2,
    selectorY,
    selectorX - selectorWidth / 4,
    selectorY - selectorHeight / 2,
    4,
  )
  selectorPath.arcTo(
    selectorX,
    selectorY - selectorHeight,
    selectorX + selectorWidth / 4,
    selectorY - selectorHeight / 2,
    4,
  )
  selectorPath.arcTo(
    selectorX + selectorWidth / 2,
    selectorY,
    selectorX,
    selectorY,
    4,
  )

  ctx.fill(selectorPath)
  ctx.stroke(selectorPath)

  ctx.restore()

  return {
    path: selectorPath,
    width: selectorWidth,
    height: selectorHeight,
    x: selectorX,
    y: selectorY,
  }
}

export const drawSelector = (selectorCanvas: HTMLCanvasElement) => {
  const ctx = selectorCanvas.getContext('2d') as CanvasRenderingContext2D

  const center = selectorCanvas.width / 2
  const radius = selectorCanvas.width / 2

  ctx.save()

  ctx.restore()

  ctx.save()

  const selectorWidth = Math.min(30, selectorCanvas.clientWidth * 0.045)
  const selectorHeight = Math.min(80, selectorCanvas.clientHeight * 0.03)

  const selectorX = center
  const selectorY = radius * 0.05 + selectorHeight

  const strokeGradient = ctx.createLinearGradient(
    selectorX,
    selectorY - selectorHeight,
    selectorX,
    selectorY,
  )

  strokeGradient.addColorStop(0.075, '#6FCF97')
  strokeGradient.addColorStop(0.925, '#6FCF97')

  ctx.strokeStyle = strokeGradient
  ctx.fillStyle = '#3E4145'
  ctx.lineWidth = 2

  ctx.beginPath()
  ctx.moveTo(selectorX, selectorY)

  ctx.arcTo(
    selectorX - selectorWidth / 2,
    selectorY,
    selectorX - selectorWidth / 4,
    selectorY - selectorHeight / 2,
    3,
  )
  ctx.arcTo(
    selectorX,
    selectorY - selectorHeight,
    selectorX + selectorWidth / 4,
    selectorY - selectorHeight / 2,
    3,
  )
  ctx.arcTo(selectorX + selectorWidth / 2, selectorY, selectorX, selectorY, 3)
  ctx.closePath()

  ctx.fill()
  ctx.stroke()

  ctx.restore()
}
