import { z } from 'zod'

const zUnixTimestampMs = z.custom<number>((val) => {
  if (typeof val !== 'number') return false

  return z.number().int().min(1000000000000).safeParse(val).success
}, 'Wrong unix timestamp value')

export { zUnixTimestampMs }
