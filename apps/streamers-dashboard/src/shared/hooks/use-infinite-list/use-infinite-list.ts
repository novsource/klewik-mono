/**
  The concept of how this hook works was taken from the "ahooks" library.
  Resource: https://ahooks.js.org/hooks/use-infinite-scroll/
 */
import type { RefObject } from 'react'
import { useCallback, useRef, useState } from 'react'

import { useInfiniteScroll } from '../use-infinite-scroll/use-infinite-scroll'

type ServiceFunction<Return> = () => Promise<Return>

export type UseInfiniteListServiceFunction<ListDataItem> = ServiceFunction<Maybe<{ list: ListDataItem[] }>>

export type UseInfiniteListState = {
  page: number
  limit: number
  isCanLoadMore: boolean
  isDisabled: boolean
}

export type ClearListOptions = {
  resetPages?: boolean
}

export type UseInfiniteListReturn<ListDataItem, ListElement extends HTMLElement | Window = HTMLDivElement> = {
  ref: RefObject<ListElement>
  state: UseInfiniteListState & {
    value: ListDataItem[]
    isPending: boolean
  }
  functions: {
    loadMore: ServiceFunction<void>
    reset: () => void
    clearList: (options?: ClearListOptions) => void
    updateIsCanLoadMore: (value: boolean) => void
    enable: () => void
    disable: () => void
  }
}

export type UseInfiniteListOptions<T> = {
  initial?: T[]
  limit?: number
  distance?: number
}

export const useInfiniteList = <ListDataItem, ListElement extends HTMLElement | Window = HTMLDivElement>(
  serviceFn: UseInfiniteListServiceFunction<ListDataItem>,
  options?: UseInfiniteListOptions<ListDataItem>,
): UseInfiniteListReturn<ListDataItem, ListElement> => {
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
    async () => {
      try {
        const { isCanLoadMore, isDisabled } = listState

        if (internalIsPendingRef.current || !isCanLoadMore || isDisabled)
          return

        internalIsPendingRef.current = true
        setIsPending(true)
        const newData = await serviceFn()
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
      catch {
        setIsPending(false)
        internalIsPendingRef.current = false
      }
    },
    [serviceFn, listState],
  )

  const infiniteScroll = useInfiniteScroll<ListElement>(_ => loadMore(), { distance: options?.distance ?? 20 })

  const isLoading = infiniteScroll.loading || isPending

  const reset = () => {
    internalIsPendingRef.current = false

    setValue(() => options?.initial ?? [])
    setListState(curr => ({ ...curr, isCanLoadMore: true, page: 1 }))
  }

  const clearList = (stateOptions?: ClearListOptions) => {
    if (stateOptions?.resetPages) {
      setListState(curr => ({ ...curr, page: 1 }))
    }

    setValue(options?.initial ?? [])
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
      clearList,
      reset,
      updateIsCanLoadMore: value => setListState(curr => ({ ...curr, isCanLoadMore: value })),
      enable: () => setListState(curr => ({ ...curr, isDisabled: false })),
      disable: () => setListState(curr => ({ ...curr, isDisabled: true })),
    },
  }
}
