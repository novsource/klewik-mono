import { useCallback, useRef } from 'react'

const useDebouncedCallback = <Args extends unknown>(
  callback: (...args: Args[]) => void,
  ms: number
) => {
  const timerRef = useRef<NullablePossible<NodeJS.Timeout>>(null)

  const debouncedCallback = useCallback(
    (...args: Args[]) => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        // @ts-expect-error nullable timerRef
        clearTimeout(timerRef.current)

        return callback(...args)
      }, ms)
    },
    [callback, timerRef.current, ms]
  )

  return debouncedCallback
}

export { useDebouncedCallback }
