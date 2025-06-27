import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

const useResizeObserver = (target: RefObject<Element>, onChange?: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void) => {
  const [entries, setEntries] = useState<ResizeObserverEntry[]>([])

  const resizeObserverRef = useRef<NullablePossible<ResizeObserver>>(null)
  const onChangeHandlerRef = useRef(onChange)

  useEffect(() => {
    const element = target.current

    if (!element)
      return

    const observer = new ResizeObserver((entries) => {
      setEntries(entries)
      onChangeHandlerRef.current && onChangeHandlerRef.current(entries, observer)
    })

    observer.observe(element)
    resizeObserverRef.current = observer

    return () => {
      observer.disconnect()
      resizeObserverRef.current = null
    }
  }, [target, onChange])

  return { entries }
}

export { useResizeObserver }
