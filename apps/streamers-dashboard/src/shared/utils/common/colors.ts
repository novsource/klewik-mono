import type { HexColor, RGBAColor } from '~shared/lib/zod'

export const hexToRgba = (hex: HexColor, alpha = 1): RGBAColor => {
  const matchesArr = hex.match(/\w\w/g)

  if (!matchesArr)
    return `rgba(0,0,0,${alpha})` as RGBAColor

  const [r, g, b] = matchesArr.map(x => Number.parseInt(x, 16))

  return `rgba(${r},${g},${b},${alpha})` as RGBAColor
}

export const getRandomRGBColor = () => {
  return `rgb(${Math.random() * 255},${Math.random() * 255},${
    Math.random() * 255
  })` as const
}

export const getRandomHEXColor = () => {
  return `#${Math.floor(16777215 * Math.random()).toString(16)}` as const
}

export const getRandomHSLColor = () => {
  return `hsl(${360 * Math.random()},40%,48%)` as const
}

export const hslToHEX = (
  hue: number,
  saturation: number,
  lightness: number,
) => {
  lightness /= 100

  const a = (saturation * Math.min(lightness, 1 - lightness)) / 100
  const f = (n: number) => {
    const k = (n + hue / 30) % 12
    const color = lightness - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

const createHEXColorGenerator = () => {
  const goldenRatio = 0.618033988749895

  let seed = 0

  return () => {
    seed += goldenRatio
    seed %= 1
    return hslToHEX(seed * 360, 55, 55) as HexColor
  }
}

export const getHEXColor = createHEXColorGenerator()
