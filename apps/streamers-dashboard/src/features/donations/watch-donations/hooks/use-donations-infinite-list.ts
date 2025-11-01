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
  = (
    query: UseInfiniteListServiceFunction<ProcessedDonation>,
    donations: ProcessedDonation[],
    options: UseInfiniteListOptions<ProcessedDonation>,
  ) => {
    const [isListReseted, setIsListReseted] = useState(false)

    const isFirstRender = useIsFirstRender()

    const {
      ref,
      state: infiniteListState,
      functions: { loadMore, reset },
    } = useInfiniteList<ProcessedDonation>(query, options)

    const listItems = useMemo(() => {
      const newDonations = [...donations]

      const updatedListDonations = newDonations.reduce<ProcessedDonation[]>(
        (acc, donation, index) => {
          const slotInList = infiniteListState.value.find(item => item.id === donation.id)

          if (slotInList) {
            newDonations.splice(index, 1)

            acc.push({ ...slotInList, ...donation })
            return acc
          }

          return acc
        },
        [],
      )

      const items = [...newDonations, ...updatedListDonations]
        .sort((first, second) => second.id - first.id)

      return items
    }, [donations, infiniteListState.value])

    const isListEmpty = listItems.length < infiniteListState.limit

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
