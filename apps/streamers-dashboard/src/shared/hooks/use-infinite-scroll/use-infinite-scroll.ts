/**
  The concept of how this hook works was taken from the "ahooks" library.
  Resource: https://ahooks.js.org/hooks/use-infinite-scroll/
 */
import { useCallback, useRef, useState } from 'react'

type InfiniteScrollService<T> = (
  scrollState: { currentPage: number, limit: number },
  ...serviceArgs: unknown[]
) => Promise<{ list: T[] }>

type InfiniteScrollReturn<T> = {
  state: {
    fetchedData: T[]
    page: number
    pageLimit: number
    isPending: boolean
    isCanLoadMore: boolean
    isDisabled: boolean
  }
  functions: {
    loadMore: (...args: Parameters<InfiniteScrollService<T>>) => Promise<void>
    reset: () => void
    enable: () => void
    disable: () => void
    updatePageLimit: (limit: number) => void
  }
}

type InfiniteScrollOptions<T> = {
  externalDataSource?: T[]
  pageLimit: number
}

const useInfiniteScroll = <T>(
  serviceFn: InfiniteScrollService<T>,
  options: InfiniteScrollOptions<T>,
): InfiniteScrollReturn<T> => {
  const [fetchedData, setFetchedData] = useState<
    Awaited<ReturnType<typeof serviceFn>>['list']
  >([])

  const [page, setPage] = useState(1)
  const [pageLimit, setPageLimit] = useState(() => options.pageLimit)
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
      setFetchedData(curr => [...curr, ...newData.list])
      setPage(currentPage => currentPage + 1)
      setIsCanLoadMore(newData.list.length > pageLimit)

      internalIsPendingRef.current = false
    },
    [serviceFn, pageLimit, isCanLoadMore, isDisabled],
  )

  return {
    state: {
      fetchedData,
      page,
      pageLimit,
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
      updatePageLimit: (limit: number) => setPageLimit(limit),
    },
  }
}

export { useInfiniteScroll }
