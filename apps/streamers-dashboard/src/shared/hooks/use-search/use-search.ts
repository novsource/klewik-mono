import { useState } from 'react'

import { useDebounceCallback } from '../use-debounced-callback'

export type UseSearchReturnValue = {
  state: {
    value: string
    isDebouncing: boolean
  }
  actions: {
    clear: () => void
    cancel: () => void
    start: () => void
    updateValue: (value: string) => void
  }
}

export type UseSearchOptions = {
  initialValue?: string
  debounceTime?: number
  onSearch?: (query: string) => void
  onCancelSearch?: (query: string) => void
}

export function useSearch(options?: UseSearchOptions): UseSearchReturnValue {
  const [searchValue, setSearchValue] = useState(options?.initialValue ?? '')
  const [isDebouncing, setIsDebouncing] = useState(false)

  const search = useDebounceCallback(() => {
    setIsDebouncing(false)

    options?.onSearch?.(searchValue)
  }, options?.debounceTime ?? 150)

  const cancel = () => {
    if (!isDebouncing)
      return

    search.cancel()
    setIsDebouncing(false)

    options?.onCancelSearch?.(searchValue)
  }

  const start = () => {
    setIsDebouncing(true)

    search()
  }

  return {
    state: {
      value: searchValue,
      isDebouncing,
    },
    actions: {
      start,
      clear: () => setSearchValue(''),
      cancel,
      updateValue: setSearchValue,
    },
  }
}
