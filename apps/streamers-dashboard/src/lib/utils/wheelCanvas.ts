import {
  clearCanvas,
  convertDegreesToRadians,
  drawSlice,
  getDegreeByArcLength,
  getMaxCircleLength,
  getPercentValue,
  getRandomHSLColor,
} from './canvas'

export const drawEmptyWheel = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const radius = canvas.width / 2

  const center = radius

  ctx.fillStyle = getRandomHSLColor()

  ctx.save()

  ctx.beginPath()
  // ctx.moveTo(center, center);
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
  items: AuctionSlot[]
) => {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const radius = canvas.width / 2

  const x = canvas.width / 2
  const y = canvas.height / 2

  let startAngle = 0
  const sumValues = items.reduce((acc, item) => acc + item['value'], 0)

  for (const item of items) {
    const sliceArcLength =
      getMaxCircleLength(radius) * getPercentValue(sumValues, item.value)
    const endAngle =
      startAngle +
      convertDegreesToRadians(getDegreeByArcLength(radius, sliceArcLength))

    drawSlice({
      context: ctx,
      sliceParameters: { x, y, radius, startAngle, endAngle },
      options: { text: item.name, color: item.auctionColor },
    })

    startAngle = endAngle
  }
}

export const drawSelector = (
  selectorCanvas: HTMLCanvasElement,
  wheelImageSize: number = 0.2
) => {
  const ctx = selectorCanvas.getContext('2d') as CanvasRenderingContext2D

  const selectorHeight = selectorCanvas.width / 50
  const center = selectorCanvas.width / 2
  const radius = selectorCanvas.width / 2

  const startAngle =
    window.devicePixelRatio <= 1
      ? convertDegreesToRadians(255)
      : convertDegreesToRadians(245)
  const endAngle =
    window.devicePixelRatio <= 1
      ? convertDegreesToRadians(285)
      : convertDegreesToRadians(295)

  ctx.strokeStyle = 'white'
  ctx.fillStyle = '#283345'
  ctx.lineWidth = 2

  ctx.save()

  // Draw circle those wrapping image in wheel center

  ctx.beginPath()

  ctx.moveTo(center, center)
  ctx.arc(center, center, radius * wheelImageSize, 0, 2 * Math.PI * radius)
  ctx.closePath()
  ctx.fill()

  ctx.restore()

  // Draw selector

  const selectorX = center
  const selectorY = center - (selectorCanvas.width * wheelImageSize) / 2

  ctx.beginPath()

  ctx.moveTo(selectorX, selectorY - selectorHeight)

  ctx.arc(
    center,
    center,
    (selectorCanvas.width * wheelImageSize) / 2,
    startAngle,
    endAngle
  )

  ctx.fill()

  ctx.closePath()

  ctx.stroke()

  ctx.restore()
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
}

export const drawSlicesAsPath2D = (
  canvas: HTMLCanvasElement,
  items: AuctionSlotWithAngles[]
) => {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  for (const item of items) {
    let { startAngle, endAngle } = item.angles

    startAngle = convertDegreesToRadians(startAngle)
    endAngle = convertDegreesToRadians(endAngle)

    drawSlice({
      context: ctx,
      sliceParameters: {
        startAngle,
        endAngle,
        x: canvas.width / 2,
        y: canvas.width / 2,
        radius: canvas.width / 2,
      },
      options: {
        color: 'transparent',
      },
      // onDraw: (slice: Path2D) => onDraw(slice, item),
    })
  }
}

export const getSlicesPath2D = (
  canvas: HTMLCanvasElement,
  items: AuctionSlotWithAngles[]
) => {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const center = canvas.width / 2

  return items.reduce(
    (acc, item) => {
      const slice = new Path2D()

      const x = center
      const y = center
      const radius = center

      const startAngle = convertDegreesToRadians(item.angles.startAngle)
      const endAngle = convertDegreesToRadians(item.angles.endAngle)

      slice.moveTo(x, y)
      slice.arc(x, y, radius - ctx.lineWidth, startAngle, endAngle)
      slice.closePath()
      slice.moveTo(x, y)

      acc.push({ path: slice, slot: item })

      return acc
    },
    [] as Array<{ path: Path2D; slot: AuctionSlotWithAngles }>
  )
}

export const drawSlicesItemsWithSelectedItem = (
  canvas: HTMLCanvasElement,
  selectedItem: AuctionSlotWithAngles
) => {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const center = canvas.width / 2

  drawSlice({
    context: ctx,
    sliceParameters: {
      x: center,
      y: center,
      radius: center,
      startAngle: convertDegreesToRadians(selectedItem.angles.startAngle),
      endAngle: convertDegreesToRadians(selectedItem.angles.endAngle),
    },
    options: {
      text: selectedItem.name,
      color: selectedItem.auctionColor,
    },
  })
}

export const getSliceInfo = (
  canvas: HTMLCanvasElement,
  items: AuctionSlotWithAngles[],
  mouse: {
    x: number
    y: number
  }
) => {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const center = canvas.width / 2

  return items.forEach((item) =>
    drawSlice({
      context: ctx,
      sliceParameters: {
        x: center,
        y: center,
        radius: center,
        startAngle: convertDegreesToRadians(item.angles.startAngle),
        endAngle: convertDegreesToRadians(item.angles.endAngle),
      },
      options: {
        text: item.name,
        color: item.auctionColor,
      },
      onDraw: (slice) => {
        if (ctx.isPointInPath(slice, mouse.x, mouse.y)) console.log(item)
      },
    })
  )
}

export const getItemsWithAngles = <T extends AuctionSlot>(
  lots: T[] | null,
  wheelMode?: WheelMode
): AuctionSlotWithAngles[] => {
  if (!lots || lots.length === 0) return []

  const newLots = wheelMode === 'dropout' ? reverseLotsByValue(lots) : [...lots]

  const sumItemsValue = newLots.reduce((acc, lot) => acc + lot['value'], 0)

  // Radius size not important
  const radius = 1

  const maxWheelArcLength = getMaxCircleLength(radius)

  let startAngle = 0

  return newLots.reduce((acc: AuctionSlotWithAngles[], item: AuctionSlot) => {
    const itemArcLength =
      maxWheelArcLength * getPercentValue(sumItemsValue, item['value'])

    const degrees = getDegreeByArcLength(radius, itemArcLength)
    const endAngle = startAngle + degrees

    acc.push({
      ...item,
      angles: {
        startAngle,
        endAngle,
      },
    })

    startAngle = endAngle

    return acc
  }, [])
}

export const getSlotNameOnSelector = (
  currentRotateDegree: number,
  lots: AuctionSlotWithAngles[],
  selectorDegree: number = 270
) => {
  const rotateAngle =
    currentRotateDegree >= 360
      ? currentRotateDegree - 360 * Math.floor(currentRotateDegree / 360)
      : currentRotateDegree

  for (const lot of lots) {
    const startAngle =
      lot.angles.startAngle + rotateAngle <= 360
        ? lot.angles.startAngle + rotateAngle
        : lot.angles.startAngle +
          rotateAngle -
          360 * Math.floor((lot.angles.startAngle + rotateAngle) / 360)
    const endAngle =
      lot.angles.endAngle + rotateAngle <= 360
        ? lot.angles.endAngle + rotateAngle
        : lot.angles.endAngle +
          rotateAngle -
          360 * Math.floor((lot.angles.endAngle + rotateAngle) / 360)

    if (endAngle < startAngle && startAngle <= selectorDegree) {
      return lot.name
    }
    if (selectorDegree >= startAngle && endAngle >= selectorDegree) {
      return lot.name
    }
  }
  return ''
}

export const generateWinner = (
  slots: AuctionSlotWithAngles[]
): AuctionSlotWithAngles | null => {
  const winnerRadians = 2 * Math.PI * Math.random()

  for (const slot of slots) {
    const { startAngle, endAngle } = slot.angles

    const startAngleInRadians = convertDegreesToRadians(startAngle)
    const endAngleInRadians = convertDegreesToRadians(endAngle)

    if (
      winnerRadians >= startAngleInRadians &&
      endAngleInRadians >= winnerRadians
    ) {
      return slot
    }
  }

  return null
}

export const calculateRotateWheelCSSValue = (
  slotWithAngles: AuctionSlotWithAngles,
  spinCount: number = 10,
  selectorDegree: number = 270
) => {
  const { startAngle, endAngle } = slotWithAngles.angles

  let randomValueFromRange = null

  if (endAngle >= startAngle)
    randomValueFromRange = Math.random() * (endAngle - startAngle) + startAngle
  else {
    randomValueFromRange =
      Math.random() >= 0.5
        ? Math.random() * (360 - startAngle) + startAngle
        : Math.random() * endAngle
  }

  const rotateCSSValue =
    360 * spinCount + (selectorDegree - randomValueFromRange)

  console.log(rotateCSSValue)

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
    .map((slot) => ({ ...slot }))
    .sort((a, b) => a.value - b.value)

  let leftPointer = 0
  let rightPointer = slots.length - 1

  while (leftPointer <= rightPointer) {
    const buffer = sortedLots[leftPointer].value
    sortedLots[leftPointer].value = sortedLots[rightPointer].value
    sortedLots[rightPointer].value = buffer

    leftPointer++
    rightPointer--
  }

  return slots.map((lot) => {
    const findingLot = sortedLots.find((item) => item._id === lot._id)

    if (findingLot) {
      lot.value = findingLot.value
    }

    return { ...lot }
  })
}

export const sliceMouse = ({
  canvas,
  slice,
  item,
}: {
  canvas: HTMLCanvasElement
  slice: Path2D
  item: AuctionSlotWithAngles
}) => {
  let activeItem: {
    path2D: Path2D | null
    item: AuctionSlotWithAngles | null
  } = {
    path2D: null,
    item: null,
  }

  canvas.addEventListener('mousemove', (ev: MouseEvent) => {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    const isPointInPath = ctx.isPointInPath(
      slice,
      ev.offsetX * window.devicePixelRatio,
      ev.offsetY * window.devicePixelRatio
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
  slots: AuctionSlotWithAngles[],
  rotateValue: number
) => {
  const newSlots: AuctionSlotWithAngles[] = []

  for (const slot of slots) {
    let { startAngle, endAngle } = slot.angles

    const realRotate = rotateValue - Math.floor(rotateValue / 360) * 360

    if (startAngle + rotateValue > 360)
      startAngle =
        startAngle +
        realRotate -
        Math.floor((startAngle + realRotate) / 360) * 360
    else {
      startAngle += realRotate
    }
    if (endAngle + rotateValue > 360)
      endAngle =
        endAngle + realRotate - Math.floor((endAngle + realRotate) / 360) * 360
    else {
      endAngle += realRotate
    }

    newSlots.push({ ...slot, angles: { startAngle, endAngle } })
  }

  return newSlots
}
