import { RefObject, useEffect, useRef } from 'react'

const useResizeObserver = (
  target: RefObject<Element>,
  callback: (entries: ResizeObserverEntry[]) => void
) => {
  const resizeObserverRef = useRef<NullablePossible<ResizeObserver>>(null)

  useEffect(() => {
    const element = target.current

    if (!element) return

    const observer = new ResizeObserver(callback)

    observer.observe(element)

    resizeObserverRef.current = observer

    return () => {
      observer.unobserve(element)
      resizeObserverRef.current = null
    }
  }, [target.current])
}

export { useResizeObserver }
