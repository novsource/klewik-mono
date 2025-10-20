import type { AuctionSlot } from '~entities/auction-slot/model'

import type { WheelMode, WheelSlot } from '~entities/wheel/model'

import {
  clearCanvas,
  convertDegreesToRadians,
  drawSlice,
  getDegreeByArcLength,
  getMaxCircleLength,
  getPercentValue,
} from '~shared/utils/canvas'
import { getHEXColor } from '~shared/utils/colors'

type DrawEmptyWheelOptions = {
  color: string
}

export const drawEmptyWheel = (
  canvas: HTMLCanvasElement,
  options?: DrawEmptyWheelOptions,
) => {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const radius = canvas.width / 2

  const center = radius

  ctx.fillStyle = 'transarent'

  ctx.save()

  ctx.fillStyle = options?.color ?? getHEXColor()

  ctx.beginPath()
  ctx.arc(center, center, radius, 0, 2 * Math.PI)
  ctx.closePath()
  ctx.clip()

  ctx.fill()

  ctx.strokeStyle = 'white'
  ctx.lineWidth = 3

  ctx.stroke()

  ctx.restore()
}

export const drawSlicesItems = (
  canvas: HTMLCanvasElement,
  items: AuctionSlot[],
) => {
  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  const radius = canvas.width / 2

  const x = canvas.width / 2
  const y = canvas.height / 2

  let startAngle = 0
  const sumValues = items.reduce((acc, item) => acc + item.points, 0)

  for (const item of items) {
    const sliceArcLength
      = getMaxCircleLength(radius) * getPercentValue(sumValues, item.points)
    const endAngle
      = startAngle
        + convertDegreesToRadians(getDegreeByArcLength(radius, sliceArcLength))

    drawSlice({
      context,
      sliceData: {
        x,
        y,
        radius,
        startAngle,
        endAngle,
        color: item.color,
      },
    })

    startAngle = endAngle
  }
}

export const drawWheelOverlay = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  const center = canvas.width / 2

  ctx.fillStyle = 'rgba(0,0,0,0.65)'

  ctx.save()

  ctx.moveTo(center, center)
  ctx.arc(center, center, center, 0, Math.PI * 2 * canvas.width)
  ctx.closePath()
  ctx.fill()

  ctx.restore()
}

export const drawSlicesAsPath2D = (
  canvas: HTMLCanvasElement,
  items: WheelSlot[],
) => {
  const size = canvas.width / 2
  const context = canvas.getContext('2d') as CanvasRenderingContext2D

  for (const item of items) {
    let { startAngle, endAngle } = item

    startAngle = convertDegreesToRadians(startAngle)
    endAngle = convertDegreesToRadians(endAngle)

    drawSlice({
      context,
      sliceData: {
        x: size,
        y: size,
        radius: size,
        startAngle,
        endAngle,
        color: 'transparent',
      },
    })
  }
}

export const getSlicesPath2D = (
  canvas: HTMLCanvasElement,
  items: WheelSlot[],
) => {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const center = canvas.width / 2

  return items.reduce(
    (acc, item) => {
      const slice = new Path2D()

      const x = center
      const y = center
      const radius = center

      const startAngle = convertDegreesToRadians(item.startAngle)
      const endAngle = convertDegreesToRadians(item.endAngle)

      slice.moveTo(x, y)
      slice.arc(x, y, radius - ctx.lineWidth, startAngle, endAngle)
      slice.closePath()
      slice.moveTo(x, y)

      acc.push({ path: slice, slot: item })

      return acc
    },
    [] as Array<{ path: Path2D, slot: WheelSlot }>,
  )
}

export const drawSlicesItemsWithSelectedItem = (
  canvas: HTMLCanvasElement,
  selectedItem: WheelSlot,
) => {
  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  const center = canvas.width / 2

  drawSlice({
    context,
    sliceData: {
      x: center,
      y: center,
      radius: center,
      startAngle: convertDegreesToRadians(selectedItem.startAngle),
      endAngle: convertDegreesToRadians(selectedItem.endAngle),
      color: selectedItem.color,
    },
  })
}

export const getSliceInfo = (
  canvas: HTMLCanvasElement,
  items: WheelSlot[],
  mouse: {
    x: number
    y: number
  },
) => {
  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  const center = canvas.width / 2

  return items.forEach(item =>
    drawSlice({
      context,
      sliceData: {
        x: center,
        y: center,
        radius: center,
        startAngle: convertDegreesToRadians(item.startAngle),
        endAngle: convertDegreesToRadians(item.endAngle),
        color: item.color,
      },
      // onDraw: (slice: Path2D) => {
      //   if (context.isPointInPath(slice, mouse.x, mouse.y))
      //     console.log(item)
      // },
    }),
  )
}

export const getItemsWithAngles = <T extends AuctionSlot>(
  lots: T[] | null,
  wheelMode?: WheelMode,
): WheelSlot[] => {
  if (!lots || lots.length === 0)
    return []

  const newLots = wheelMode === 'dropout' ? reverseLotsByValue(lots) : [...lots]

  const sumItemsValue = newLots.reduce((acc, lot) => acc + lot.points, 0)

  // Radius size not important
  const radius = 1

  const maxWheelArcLength = getMaxCircleLength(radius)

  let startAngle = 0

  return newLots.reduce((acc: WheelSlot[], item: AuctionSlot) => {
    const itemArcLength
      = maxWheelArcLength * getPercentValue(sumItemsValue, item.points)

    const degrees = getDegreeByArcLength(radius, itemArcLength)
    const endAngle = startAngle + degrees

    acc.push({
      ...item,
      startAngle,
      endAngle,
    })

    startAngle = endAngle

    return acc
  }, [])
}

export const getSlotNameOnSelector = (
  currentRotateDegree: number,
  slots: WheelSlot[],
  selectorDegree: number = 270,
) => {
  const rotateAngle
    = currentRotateDegree >= 360
      ? currentRotateDegree - 360 * Math.floor(currentRotateDegree / 360)
      : currentRotateDegree

  for (const slot of slots) {
    const startAngle
      = slot.startAngle + rotateAngle <= 360
        ? slot.startAngle + rotateAngle
        : slot.startAngle
          + rotateAngle
          - 360 * Math.floor((slot.startAngle + rotateAngle) / 360)
    const endAngle
      = slot.endAngle + rotateAngle <= 360
        ? slot.endAngle + rotateAngle
        : slot.endAngle
          + rotateAngle
          - 360 * Math.floor((slot.endAngle + rotateAngle) / 360)

    if (endAngle < startAngle && startAngle <= selectorDegree) {
      return slot.title
    }
    if (selectorDegree >= startAngle && endAngle >= selectorDegree) {
      return slot.title
    }
  }
  return ''
}

export const generateWinner = (slots: WheelSlot[]): WheelSlot => {
  const winnerRadians = 2 * Math.PI * Math.random()

  for (const slot of slots) {
    const { startAngle, endAngle } = slot

    const startAngleInRadians = convertDegreesToRadians(startAngle)
    const endAngleInRadians = convertDegreesToRadians(endAngle)

    if (
      winnerRadians >= startAngleInRadians
      && endAngleInRadians >= winnerRadians
    ) {
      return slot
    }
  }

  return slots[0]
}

export const calculateRotateWheelCSSValue = (
  slotWithAngles: WheelSlot,
  spinCount: number = 10,
  selectorDegree: number = 270,
) => {
  const { startAngle, endAngle } = slotWithAngles

  let randomValueFromRange = null

  if (endAngle >= startAngle) {
    randomValueFromRange = Math.random() * (endAngle - startAngle) + startAngle
  }
  else {
    randomValueFromRange
      = Math.random() >= 0.5
        ? Math.random() * (360 - startAngle) + startAngle
        : Math.random() * endAngle
  }

  const rotateCSSValue
    = 360 * spinCount + (selectorDegree - randomValueFromRange)

  return rotateCSSValue
}

const reverseLotsByValue = (slots: AuctionSlot[]) => {
  // const sumOfLots = [...slots].reduce((acc, curr) => (acc += curr.value), 0);

  // return [...slots].map((slot) => {
  //   const reversedValue = (1 - slot.value / sumOfLots) / (slots.length - 1);

  //   console.log(reversedValue * sumOfLots);

  //   return { ...slot, value: reversedValue * sumOfLots };
  // });

  const sortedLots = slots
    .map(slot => ({ ...slot }))
    .sort((a, b) => a.points - b.points)

  let leftPointer = 0
  let rightPointer = slots.length - 1

  while (leftPointer <= rightPointer) {
    const buffer = sortedLots[leftPointer].points
    sortedLots[leftPointer].points = sortedLots[rightPointer].points
    sortedLots[rightPointer].points = buffer

    leftPointer++
    rightPointer--
  }

  return slots.map((lot) => {
    const findingLot = sortedLots.find(item => item.id === lot.id)

    if (findingLot) {
      lot.points = findingLot.points
    }

    return { ...lot }
  })
}

type SliceMouseProperties = {
  canvas: HTMLCanvasElement
  slice: Path2D
  item: WheelSlot
}

type SliceMouesActiveItem = {
  path2D: NullablePossible<Path2D>
  item: NullablePossible<WheelSlot>
}

export const sliceMouse = ({ canvas, slice, item }: SliceMouseProperties) => {
  let activeItem: SliceMouesActiveItem = {
    path2D: null,
    item: null,
  }

  canvas.addEventListener('mousemove', (ev: MouseEvent) => {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    const isPointInPath = ctx.isPointInPath(
      slice,
      ev.offsetX * window.devicePixelRatio,
      ev.offsetY * window.devicePixelRatio,
    )
    const isSameSlice = activeItem.item === item

    if (isPointInPath && !isSameSlice) {
      clearCanvas(canvas)

      activeItem = { item, path2D: slice }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
      ctx.fill(slice)
    }

    if (!isPointInPath && isSameSlice) {
      activeItem.item === null
      clearCanvas(canvas)
    }
  })
}

export const updateSlotsAnglesByRotateValue = (
  slots: WheelSlot[],
  rotateValue: number,
): WheelSlot[] => {
  const newSlots: WheelSlot[] = []

  for (const slot of slots) {
    let { startAngle, endAngle } = slot

    const realRotate = rotateValue - Math.floor(rotateValue / 360) * 360

    if (startAngle + rotateValue > 360) {
      startAngle
        = startAngle
          + realRotate
          - Math.floor((startAngle + realRotate) / 360) * 360
    }
    else {
      startAngle += realRotate
    }
    if (endAngle + rotateValue > 360) {
      endAngle
        = endAngle + realRotate - Math.floor((endAngle + realRotate) / 360) * 360
    }
    else {
      endAngle += realRotate
    }

    newSlots.push({ ...slot, startAngle, endAngle })
  }

  return newSlots
}
