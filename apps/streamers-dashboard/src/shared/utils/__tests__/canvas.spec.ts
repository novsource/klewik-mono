import { createElement } from 'react'

import { cleanup, render, screen } from '@testing-library/react'

import {
  convertDegreesToRadians,
  convertRadiansToDegrees,
  fitTextEllipsis,
  getAngleByCoords,
  getArcLength,
  getCoordsOfDotByVectorAngle,
  getDegreeByArcLength,
  getMaxCircleLength,
  getMaxSizeCanvas,
  resizeCanvasWithRatio,
} from '~shared/utils/common'

describe('#canvas utils', () => {
  beforeEach(() => {
    vi.spyOn(HTMLDivElement.prototype, 'offsetWidth', 'get').mockReturnValue(
      window.innerWidth,
    )
    vi.spyOn(HTMLDivElement.prototype, 'offsetHeight', 'get').mockReturnValue(
      window.innerHeight,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
    cleanup()
  })

  const canvas = createElement('canvas', {
    'data-testid': 'canvas',
  })
  const canvasWrapper = createElement('div', {
    'children': canvas,
    'data-testid': 'wrapper',
  })

  it('should return correct max size canvas', () => {
    render(canvasWrapper)

    const wrapper = screen.getByTestId('wrapper')

    expect(getMaxSizeCanvas(wrapper)).toBe(
      Math.min(window.innerWidth - 56, window.innerHeight - 56),
    )
  })

  it('should correct set size to canvas by wrapper size', () => {
    window.innerWidth = 1920
    window.innerHeight = 1024

    vi.spyOn(HTMLDivElement.prototype, 'getBoundingClientRect').mockReturnValue(
      {
        width: window.innerWidth,
        height: window.innerHeight,
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        x: 0,
        y: 0,
        toJSON: () => undefined,
      },
    )

    render(canvasWrapper)

    const wrapper = screen.getByTestId<HTMLDivElement>('wrapper')
    const canvasElement = screen.getByTestId<HTMLCanvasElement>('canvas')

    resizeCanvasWithRatio(canvasElement, wrapper)

    expect(`${canvasElement.width}px`).toBe(canvasElement.style.width)
    expect(`${canvasElement.height}px`).toBe(canvasElement.style.height)

    expect(canvasElement.style.width).toBe(`1920px`)
    expect(canvasElement.style.height).toBe('1920px')

    // Change window device pixel ratio for check canvas sizes
    window.devicePixelRatio = 2

    resizeCanvasWithRatio(canvasElement, wrapper)

    expect(`${canvasElement.width / 2}px`).toBe(canvasElement.style.width)
    expect(`${canvasElement.height / 2}px`).toBe(canvasElement.style.height)

    expect(canvasElement.style.width).toBe(`1920px`)
    expect(canvasElement.style.height).toBe(`1920px`)
  })

  it('should correct fit text with ellipsis separator', () => {
    render(canvasWrapper)

    const canvasElement = screen.getByTestId<HTMLCanvasElement>('canvas')
    const ctx = canvasElement.getContext('2d') as CanvasRenderingContext2D

    // Testing with short text
    expect(fitTextEllipsis(ctx, 'Short text', window.innerWidth)).toBe(
      'Short text',
    )

    // Testing with long text
    expect(
      fitTextEllipsis(
        ctx,
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
        50,
      ),
    ).toBe('Lorem ipsum dolor sit amet, consectetur adipisci...')
  })

  it('should correct convert degrees to radians', () => {
    expect(convertDegreesToRadians(120)).toBe(2.0943951023931953)
    expect(convertDegreesToRadians(-120)).toBe(-2.0943951023931953)
  })

  it('should correct convert radians to degrees', () => {
    expect(Math.ceil(convertRadiansToDegrees(2.0943951023931953))).toBe(120)
    expect(Math.floor(convertRadiansToDegrees(-2.0943951023931953))).toBe(-120)
  })

  it('should correct calculate degree by arc length', () => {
    expect(getDegreeByArcLength(10, 10)).toBe(57.29577951308232)
  })

  it('should correct calculate max circle length', () => {
    expect(getMaxCircleLength(10)).toBe(62.83185307179586)
  })

  it('should correct calculate arc length', () => {
    expect(getArcLength(30, 10)).toBe(5.235987755982989)
  })

  it('should return correct coordinates of dot by vector angle', () => {
    expect(getCoordsOfDotByVectorAngle(50, 50, 10, 30)).toEqual({
      x: 51.54251449887584,
      y: 40.11968375907138,
    })
  })

  it('should return correct angle by coordinates of dot on circle', () => {
    expect(getAngleByCoords(100, 200)).toBe(63.43494882292201)
  })
})
