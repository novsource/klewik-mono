import type { ClassArray, ClassValue } from 'clsx'

import type { tailwindScreens } from '~shared/constants/tailwindcss'

import { cn } from './cn'

type TwBreakpoint = `${keyof typeof tailwindScreens}:`
  | `min-${keyof typeof tailwindScreens}:`
  | `max-${keyof typeof tailwindScreens}:`

export const twBreakpointsJoiner
  = (breakpoint: TwBreakpoint, classNames: ClassValue) => {
    if (Array.isArray(classNames)) {
      const result = []

      for (const className of classNames) {
        result.push(joinBreakpointToClassName(breakpoint, className))
      }

      return cn(result)
    }

    return joinBreakpointToClassName(breakpoint, classNames)
  }

type JoinBreakpointToClassName = Exclude<ClassValue, ClassArray>

function joinBreakpointToClassName(breakpoint: TwBreakpoint, classNames: JoinBreakpointToClassName) {
  const isClassNamesBoolean = typeof classNames === 'boolean'
  const isClassNamesInt = typeof classNames === 'number' || typeof classNames === 'bigint'

  if (isClassNamesBoolean || !classNames || isClassNamesInt)
    return ''

  return cn(classNames.split(' ').join(` ${breakpoint}`))
}
