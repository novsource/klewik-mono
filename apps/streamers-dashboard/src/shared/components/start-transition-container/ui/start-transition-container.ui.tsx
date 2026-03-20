import type { ReactNode } from 'react'

import { useDumbedTransition } from '~shared/hooks'

export type StartTransitionContainerProps = {
  showed?: boolean
  fallback: ReactNode
  children: ReactNode
}

export const StartTransitionContainer = (props: StartTransitionContainerProps) => {
  const { children, fallback, showed } = props

  const isTransitionEnded = useDumbedTransition()

  const isShouldShowFallback = !isTransitionEnded && !showed

  if (isShouldShowFallback) {
    return fallback
  }

  return children
}
