/**
  The concept of how this hook works was taken from the "ahooks" library.
  Resource: https://ahooks.js.org/hooks/use-infinite-scroll/
*/
import { useCallback, useRef, useState } from 'react'

type InfiniteScrollService<T> = (
  scrollState: { currentPage: number; limit: number },
  ...serviceArgs: unknown[]
) => Promise<{ list: T[] }>

type InfiniteScrollReturn<T> = {
  state: {
    data: T[]
    page: number
    pageLimit: number
    isPending: boolean
    isCanLoadMore: boolean
  }
  functions: {
    loadMore: (...args: Parameters<InfiniteScrollService<T>>) => Promise<void>
    reset: () => void
    updatePageLimit: (limit: number) => void
  }
}

type InfiniteScrollOptions<T> = {
  initData?: T[]
  pageLimit: number
}

const useInfiniteScroll = <T>(
  serviceFn: InfiniteScrollService<T>,
  options: InfiniteScrollOptions<T>
): InfiniteScrollReturn<T> => {
  const [data, setData] = useState<
    Awaited<ReturnType<typeof serviceFn>>['list']
  >(() => options?.initData ?? [])

  const [page, setPage] = useState(0)
  const [pageLimit, setPageLimit] = useState(() => options.pageLimit)
  const [isCanLoadMore, setIsCanLoadMore] = useState(true)
  const [isPending, setIsPending] = useState(false)

  const internalIsPendingRef = useRef(false)

  const loadMore = useCallback(
    async (...args: Parameters<typeof serviceFn>) => {
      if (internalIsPendingRef.current || !isCanLoadMore) return

      internalIsPendingRef.current = true
      setIsPending(true)

      const newData = await serviceFn(...args)

      console.log('HERE')

      setIsPending(false)
      setData((curr) => [...curr, ...newData.list])
      setPage((currentPage) => currentPage + 1)
      setIsCanLoadMore(newData.list.length > pageLimit)

      internalIsPendingRef.current = false
    },
    [serviceFn, pageLimit]
  )

  return {
    state: {
      data,
      page,
      pageLimit,
      isPending,
      isCanLoadMore,
    },
    functions: {
      loadMore,
      reset: () => setIsCanLoadMore(false),
      updatePageLimit: (limit: number) => setPageLimit(limit),
    },
  }
}

export { useInfiniteScroll }
