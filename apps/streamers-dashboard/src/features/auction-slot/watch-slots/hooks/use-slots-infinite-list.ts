import { useMemo, useState } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'

import type {
  UseInfiniteListOptions,
  UseInfiniteListServiceFunction,
} from '~shared/hooks'
import {
  useDidUpdate,
  useInfiniteList,
  useIsFirstRender,
} from '~shared/hooks'

import { objectToDeps } from '~shared/utils'

export const useSlotsInfiniteList
  = <Args = unknown>(
    query: UseInfiniteListServiceFunction<AuctionSlot, Args>,
    slots: AuctionSlot[],
    options: UseInfiniteListOptions<AuctionSlot>,
  ) => {
    const [isListReseted, setIsListReseted] = useState(false)

    const isFirstRender = useIsFirstRender()

    const {
      ref,
      state: infiniteListState,
      functions: { loadMore, reset },
    } = useInfiniteList<AuctionSlot, Args>(query, options)

    const listItems = useMemo(() => {
      return [...slots, ...infiniteListState.value]
    }, [slots, infiniteListState.value])

    const isListEmpty = listItems.length === 0

    if (isListEmpty && isFirstRender) {
      loadMore()
    }

    useDidUpdate(() => {
      const isListItemsLessThenLimit = listItems.length < infiniteListState.limit
      const isPossibleToLoadMore = infiniteListState.isCanLoadMore && !infiniteListState.isPending

      if (isListItemsLessThenLimit && isPossibleToLoadMore && isListReseted) {
        loadMore()
        setIsListReseted(false)
      }
    }, [
      ...objectToDeps(infiniteListState, ['isCanLoadMore', 'isPending']),
      listItems,
      isListReseted,
    ])

    const resetList = () => {
      reset()
      setIsListReseted(true)
    }

    return { ref, listItems, infiniteListState, loadMore, reset: resetList }
  }
