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

export type UseInfiniteListServiceFunction<ListDataItem, Args> = ServiceFunction<Args, { list: ListDataItem[] }>

export type UseInfiniteListState = {
  page: number
  limit: number
  isPending: boolean
  isCanLoadMore: boolean
  isDisabled: boolean
}

export type UseInfiniteListReturn<ListDataItem, ServiceArgs> = {
  ref: StateRef<Element>
  state: UseInfiniteListState & {
    value: ListDataItem[]
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
  onListEnd: () => Promise<void> | void
  limit?: number
  initial?: T[]
}

export const useInfiniteList = <ListDataItem, ServiceArgs = unknown>(
  serviceFn: UseInfiniteListServiceFunction<ListDataItem, ServiceArgs>,
  options: UseInfiniteListOptions<ListDataItem>,
): UseInfiniteListReturn<ListDataItem, ServiceArgs> => {
  const [value, setValue] = useState<ListDataItem[]>(options?.initial ?? [])
  const [listState, setListState] = useState<UseInfiniteListState>({
    page: 1,
    limit: options?.limit ?? 15,
    isPending: false,
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

        setListState(curr => ({ ...curr, isPending: true }))

        const newData = await serviceFn(args)

        setListState(curr => ({
          ...curr,
          page: curr.page++,
          isCanLoadMore: newData.list.length >= curr.limit,
          isPending: false,
        }))
        setValue(curr => [...curr, ...newData.list])

        internalIsPendingRef.current = false
      }
      catch (_) {
        setListState(curr => ({ ...curr, isPending: false }))
        internalIsPendingRef.current = false
      }
    },
    [serviceFn, listState],
  )

  const infiniteScroll = useInfiniteScroll(options.onListEnd)

  const isLoading = infiniteScroll.loading || listState.isPending

  console.log(isLoading)

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
      clearList: () => setValue([]),
      enable: () => setListState(curr => ({ ...curr, isDisabled: false })),
      disable: () => setListState(curr => ({ ...curr, isDisabled: true })),
      reset: () => {
        setValue(() => options?.initial ?? [])
        setListState(curr => ({ ...curr, isCanLoadMore: true, page: 1 }))
      },
      updateLimit: (limit: number) => setListState(curr => ({ ...curr, limit })),
    },
  }
}
