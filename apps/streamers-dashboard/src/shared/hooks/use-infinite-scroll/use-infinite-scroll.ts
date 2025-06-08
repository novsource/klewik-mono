/**
  The concept of how this hook works was taken from the "ahooks" library.
  Resource: https://ahooks.js.org/hooks/use-infinite-scroll/
*/
import { useCallback, useState } from 'react'

type InfiniteScrollService<T> = (...args: T[]) => Promise<{ list: T[] }>

type InfiniteScrollOptions<T> = {
  initData?: T[]
}

const useInfiniteScroll = <T>(
  serviceFn: InfiniteScrollService<T>,
  options?: InfiniteScrollOptions<T>
) => {
  const [isPending, setIsPending] = useState(false)

  const [data, setData] = useState<
    Awaited<ReturnType<typeof serviceFn>>['list']
  >(() => options?.initData ?? [])

  const loadMore = useCallback(
    async (...args: Parameters<typeof serviceFn>) => {
      if (isPending) return

      setIsPending(true)

      const newData = await serviceFn(...args)

      setData((curr) => [...curr, ...newData.list])
      setIsPending(false)
    },
    [serviceFn]
  )

  return { data, isPending, loadMore }
}

export { useInfiniteScroll }
