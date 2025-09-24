export const docsPaths = [
  'beforeUse',
  'about',
  'getStarted',
  'integrations',
  'points',
  'slots',
  'donations',
  'viewers',
] as const

export type DocsPaths = typeof docsPaths[number]
