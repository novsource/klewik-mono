/**
  The concept of how this hook works was taken from the "ahooks" library.
  Resource: https://ahooks.js.org/hooks/use-infinite-scroll/
 */
import { useCallback, useRef, useState } from 'react'

type InfiniteScrollService<ListDataItem, ServiceArgs>
= (serviceArgs: ServiceArgs) => Promise<{ list: ListDataItem[] }>

type InfiniteScrollReturn<ListDataItem, ServiceArgs> = {
  state: {
    value: ListDataItem[]
    page: number
    limit: number
    isPending: boolean
    isCanLoadMore: boolean
    isDisabled: boolean
  }
  functions: {
    loadMore: (...args: Parameters<InfiniteScrollService<ListDataItem, ServiceArgs>>) => Promise<void>
    reset: () => void
    enable: () => void
    disable: () => void
    updateLimit: (limit: number) => void
  }
}

type InfiniteScrollOptions<T> = {
  limit: number
  initial?: T[]
}

const useInfiniteScroll = <ListDataItem, ServiceArgs = void>(
  serviceFn: InfiniteScrollService<ListDataItem, ServiceArgs>,
  options: InfiniteScrollOptions<ListDataItem>,
): InfiniteScrollReturn<ListDataItem, ServiceArgs> => {
  const [value, setValue] = useState<ListDataItem[]>(options.initial ?? [])

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(options.limit)
  const [isCanLoadMore, setIsCanLoadMore] = useState(true)
  const [isPending, setIsPending] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  const internalIsPendingRef = useRef(false)

  const loadMore = useCallback(
    async (...args: Parameters<typeof serviceFn>) => {
      if (internalIsPendingRef.current || !isCanLoadMore || isDisabled)
        return

      internalIsPendingRef.current = true
      setIsPending(true)

      const newData = await serviceFn(...args)

      setIsPending(false)
      setValue(curr => [...curr, ...newData.list])
      setPage(currentPage => currentPage + 1)
      setIsCanLoadMore(newData.list.length >= limit)

      internalIsPendingRef.current = false
    },
    [serviceFn, limit, isCanLoadMore, isDisabled],
  )

  return {
    state: {
      value,
      page,
      limit,
      isPending,
      isCanLoadMore,
      isDisabled,
    },
    functions: {
      loadMore,
      enable: () => setIsDisabled(false),
      disable: () => setIsDisabled(true),
      reset: () => {
        setIsCanLoadMore(true)
        setPage(1)
      },
      updateLimit: (limit: number) => setLimit(limit),
    },
  }
}

export { useInfiniteScroll }
