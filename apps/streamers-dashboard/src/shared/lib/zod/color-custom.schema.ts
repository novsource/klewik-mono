import { z } from 'zod'

const zHexColor = z.custom<`#${string}`>((val: unknown) => {
  return typeof val === 'string'
    ? z.string().min(3).max(6).safeParse(val).success
    : false
}, 'Zod parse error: Wrong hex color value')

const zRGBColor = z.custom<[number, number, number, number?]>((val) => {
  if (!Array.isArray(val)) {
    return false
  }

  for (const num of val) {
    if (Number.isInteger(num) || !Number(num)) return false

    if (!z.number().min(0).max(255).safeParse(num).success) {
      return false
    }
  }

  return true
}, 'Zod parse error: Wrong RGB color value')

export { zHexColor, zRGBColor }
