import { RefObject, useCallback, useEffect, useRef, useState } from 'react'

type IntersectionReturn = {
  entry: IntersectionObserverEntry
  inView: boolean
}

const useIntersection = (
  targetRef: RefObject<HTMLElement | null>,
  options?: Partial<IntersectionObserverInit>
) => {
  const [inView, setInView] = useState<IntersectionReturn['inView']>(false)
  const [entry, setEntry] = useState<IntersectionReturn['entry'] | null>(null)

  const observer = useRef<IntersectionObserver | null>(null)

  const intersectionCallback = useCallback<IntersectionObserverCallback>(
    (entries) => {
      entries.forEach((entry) => {
        const thresholds = Array.isArray(options?.threshold)
          ? options?.threshold
          : [options?.threshold ?? 0]

        const inView =
          entry.isIntersecting &&
          thresholds.some((threshold) => threshold <= entry.intersectionRatio)

        setInView(inView)
        setEntry(entry)
      })
    },
    [options?.threshold]
  )

  useEffect(() => {
    const target = targetRef.current

    if (target === null) {
      setInView(false)
      setEntry(null)

      return
    }

    if (observer.current === null) {
      const targetObserver = new IntersectionObserver(
        intersectionCallback,
        options
      )

      observer.current = targetObserver
      observer.current.observe(target)
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
        observer.current = null
      }
    }
  }, [targetRef, intersectionCallback, options])

  return { inView, entry }
}

export { useIntersection }
