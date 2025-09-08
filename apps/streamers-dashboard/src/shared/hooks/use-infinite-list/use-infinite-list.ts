import type { StateRef } from '../use-ref-state/use-ref-state'

/**
  The concept of how this hook works was taken from the "ahooks" library.
  Resource: https://ahooks.js.org/hooks/use-infinite-scroll/
 */
import { useCallback, useRef, useState } from 'react'

import { useInfiniteScroll } from '../use-infinite-scroll/use-infinite-scroll'

type ServiceFunction<Args, Return>
= Args extends undefined ? () => Promise<Return>
  : Args extends unknown[]
    ? (...serviceArgs: Args) => Promise<Return>
    : (serviceArgs: Args) => Promise<Return>

export type UseInfiniteListServiceFunction<ListDataItem, Args = undefined> = ServiceFunction<Args, Maybe<{ list: ListDataItem[] }>>

export type UseInfiniteListState = {
  page: number
  limit: number
  isCanLoadMore: boolean
  isDisabled: boolean
}

export type UseInfiniteListReturn<ListDataItem, ServiceArgs> = {
  ref: StateRef<HTMLDivElement>
  state: UseInfiniteListState & {
    value: ListDataItem[]
    isPending: boolean
  }
  functions: {
    loadMore: ServiceFunction<ServiceArgs, void>
    reset: () => void
    clearList: () => void
    enable: () => void
    disable: () => void
    updateLimit: (limit: number) => void
  }
}

export type UseInfiniteListOptions<T> = {
  limit?: number
  initial?: T[]
}

export const useInfiniteList = <ListDataItem, ServiceArgs = unknown>(
  serviceFn: UseInfiniteListServiceFunction<ListDataItem, ServiceArgs>,
  options?: UseInfiniteListOptions<ListDataItem>,
): UseInfiniteListReturn<ListDataItem, ServiceArgs> => {
  const [value, setValue] = useState<ListDataItem[]>(options?.initial ?? [])
  const [isPending, setIsPending] = useState(false)
  const [listState, setListState] = useState<UseInfiniteListState>({
    page: 1,
    limit: options?.limit ?? 15,
    isCanLoadMore: true,
    isDisabled: false,
  })

  const internalIsPendingRef = useRef(false)

  const loadMore = useCallback(
    async (args: ServiceArgs) => {
      try {
        const { isCanLoadMore, isDisabled } = listState

        if (internalIsPendingRef.current || !isCanLoadMore || isDisabled)
          return

        internalIsPendingRef.current = true
        setIsPending(true)
        const newData = await serviceFn(args)
        setIsPending(false)
        internalIsPendingRef.current = false

        if (newData) {
          setListState(curr => ({
            ...curr,
            page: curr.page++,
            isCanLoadMore: newData.list.length >= curr.limit,
          }))
          setValue(curr => [...curr, ...newData.list])
        }
      }
      catch (_) {
        setIsPending(false)
        internalIsPendingRef.current = false
      }
    },
    [serviceFn, listState],
  )

  const infiniteScroll = useInfiniteScroll<HTMLDivElement>(_ => loadMore())

  const isLoading = infiniteScroll.loading || isPending

  const resetList = () => {
    internalIsPendingRef.current = false

    setValue(() => options?.initial ?? [])
    setListState(curr => ({ ...curr, isCanLoadMore: true, page: 1 }))
  }

  return {
    ref: infiniteScroll.ref,
    state: {
      value,
      limit: listState.limit,
      page: listState.page,
      isPending: isLoading,
      isCanLoadMore: listState.isCanLoadMore,
      isDisabled: listState.isDisabled,
    },
    functions: {
      loadMore,
      reset: resetList,
      clearList: () => setValue([]),
      enable: () => setListState(curr => ({ ...curr, isDisabled: false })),
      disable: () => setListState(curr => ({ ...curr, isDisabled: true })),
      updateLimit: (limit: number) => setListState(curr => ({ ...curr, limit })),
    },
  }
}
