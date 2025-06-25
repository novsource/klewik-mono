import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

const useResizeObserver = (target: RefObject<Element>) => {
  const [entries, setEntries] = useState<ResizeObserverEntry[]>([])

  const resizeObserverRef = useRef<NullablePossible<ResizeObserver>>(null)

  useEffect(() => {
    const element = target.current

    if (!element)
      return

    const observer = new ResizeObserver(setEntries)

    observer.observe(element)
    resizeObserverRef.current = observer

    return () => {
      observer.unobserve(element)
      resizeObserverRef.current = null
    }
  }, [target])

  return { entries }
}

export { useResizeObserver }
