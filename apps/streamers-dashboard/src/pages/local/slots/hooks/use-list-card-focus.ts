import { useEffect, useRef, useState } from 'react'

import { useActiveElement, usePrevious } from '~shared/hooks'

export type UseListCardFocusOptions = {
  onFocus?: () => void
  onBlur?: () => void
}

export const useListCardFocus = (options?: UseListCardFocusOptions) => {
  const optionsRef = useRef(options)
  optionsRef.current = options

  const { ref, value: activeElement } = useActiveElement<HTMLDivElement>()

  const [isActiveElementInside, setIsActiveElementInside] = useState(() => (ref.current?.contains(activeElement) || ref.current === activeElement) ?? false)

  const previousWasActive = usePrevious(isActiveElementInside)

  useEffect(() => {
    const isFocused = ref.current?.contains(activeElement) || ref.current === activeElement

    if (isFocused !== isActiveElementInside) {
      setIsActiveElementInside(isFocused)

      if (isFocused) {
        optionsRef.current?.onFocus?.()
      }
      else {
        optionsRef.current?.onBlur?.()
      }
    }
  }, [previousWasActive, isActiveElementInside, activeElement, ref.state])

  return { ref, isFocused: isActiveElementInside }
}
