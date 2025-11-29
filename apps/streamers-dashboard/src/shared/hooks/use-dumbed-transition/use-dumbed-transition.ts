import { startTransition, useEffect, useState } from 'react'

export const useDumbedTransition = () => {
  const [isTransitionEnded, setIsTransitionEnded] = useState(false)

  useEffect(() => {
    startTransition(() => setIsTransitionEnded(true))
  }, [])

  return isTransitionEnded
}
