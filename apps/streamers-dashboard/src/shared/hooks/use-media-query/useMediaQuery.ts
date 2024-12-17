import { useEffect, useState } from 'react'

type MediaQueryHookOptions = {
  defaultValue: boolean
  initWithValue: boolean
}

const getMatch = (value: string) => {
  return window.matchMedia(value).matches
}

export const useMediaQuery = (
  query: string,
  options?: MediaQueryHookOptions
) => {
  const [isMatch, setIsMatch] = useState<boolean>(() => {
    const initValue = options?.initWithValue ?? true
    const defaultVal = options?.defaultValue ?? false

    return initValue ? getMatch(query) : defaultVal
  })

  useEffect(() => {
    const checkMediaMatch = () => {
      setIsMatch(getMatch(query))
    }

    const eventController = new AbortController()
    const matchMedia = window.matchMedia(query)

    const isDepreceatedBrowser = !!matchMedia.addListener

    if (isDepreceatedBrowser) {
      matchMedia.addListener(checkMediaMatch)
    } else {
      matchMedia.addEventListener('change', checkMediaMatch, {
        signal: eventController.signal,
      })
    }

    return () => {
      if (isDepreceatedBrowser) {
        matchMedia.removeListener(checkMediaMatch)
      }

      eventController.abort()
    }
  }, [query])

  return isMatch
}
