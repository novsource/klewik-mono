import { z } from 'zod'

export type HexColor = `#${string}`

export const HexColorSchema = z.custom<HexColor>((val: unknown) => {
  return typeof val === 'string'
    ? z.string().min(4).max(7).safeParse(val).success
    : false
}, 'Zod parse error: Wrong hex color value')

export type RGBAColor = `rgba(${number}, ${number}, ${number}, ${number | undefined}]})`

export const RGBColorSchema = z.custom<RGBAColor>((val) => {
  if (!Array.isArray(val)) {
    return false
  }

  for (const num of val) {
    if (Number.isInteger(num) || !Number(num))
      return false

    if (!z.number().min(0).max(255).safeParse(num).success) {
      return false
    }
  }

  return true
}, 'Zod parse error: Wrong RGB color value')
