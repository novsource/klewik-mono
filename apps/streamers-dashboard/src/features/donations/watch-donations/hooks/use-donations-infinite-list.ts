import { useMemo, useState } from 'react'

import type { ProcessedDonation } from '~entities/donation/model'

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

export const useDonationsInfiniteList
  = <Args = unknown>(
    query: UseInfiniteListServiceFunction<ProcessedDonation, Args>,
    donations: ProcessedDonation[],
    options: UseInfiniteListOptions<ProcessedDonation>,
  ) => {
    const [isListReseted, setIsListReseted] = useState(false)

    const isFirstRender = useIsFirstRender()

    const {
      ref,
      state: infiniteListState,
      functions: { loadMore, reset },
    } = useInfiniteList<ProcessedDonation, Args>(query, options)

    const listItems = useMemo(() => {
      return [...donations, ...infiniteListState.value]
    }, [donations, infiniteListState.value])

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
