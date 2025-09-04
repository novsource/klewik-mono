import { useMemo, useRef, useState } from 'react'

import { isAxiosError } from 'axios'

import type { LoadMoreDonationsQueryArgs } from '~features/donations/watch-donations/api'
import { useLazyLoadMoreDonationsQuery } from '~features/donations/watch-donations/api'

import { auctionSelectors } from '~entities/auction/store'

import type { ProcessedDonation, ProcessedDonationStatus } from '~entities/donation/model'
import { donationsActions } from '~entities/donation/store'

import type {
  UseInfiniteListOptions,
} from '~shared/hooks'
import {
  useDidUpdate,
  useInfiniteList,
  useIsFirstRender,
  useUnmount,
} from '~shared/hooks'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { toastErrorNotification } from '~shared/ui/toaster/lib'

const wait = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms))

export const useDonationsInfinityList
  = (
    donations: ProcessedDonation[],
    status: NullablePossible<ProcessedDonationStatus>,
    options: UseInfiniteListOptions<ProcessedDonation>,
  ) => {
    const [isListReseted, setIsListReseted] = useState(false)

    const { addDonation } = useActionCreators(donationsActions)
    const auctionInfo = useStoreSelector(auctionSelectors.getAuctionInfo)

    const [loadMoreDonationsQuery] = useLazyLoadMoreDonationsQuery()

    const isFirstRender = useIsFirstRender()

    const previousStatusRef = useRef(status)
    const queryRef = useRef<NullablePossible<ReturnType<typeof loadMoreDonationsQuery>>>(null)

    const {
      ref,
      state: infiniteListState,
      functions: { loadMore, reset: resetList, clearList },
    } = useInfiniteList<ProcessedDonation, Pick<LoadMoreDonationsQueryArgs, 'after'>>(
      async () => {
        try {
          await wait(2000)

          const request = loadMoreDonationsQuery({
            auctionUUID: auctionInfo.auctionUUID,
            limit: infiniteListState.limit,
            order: 'descending',
            status: status || 'all',
          })

          queryRef.current = request
          const response = await request
          queryRef.current = null

          if (response.isError) {
            throw response.error
          }

          if (!response || !response.data) {
            return { list: [] }
          }

          response.data.forEach(addDonation)

          return { list: response.data }
        }
        catch (err) {
          if (isAxiosError(err)) {
            toastErrorNotification(err.message)
          }

          queryRef.current = null

          return { list: [] }
        }
      },
      options,
    )

    const listItems = useMemo(() => {
      return [...donations, ...infiniteListState.value]
    }, [donations, infiniteListState.value])

    const isListEmpty = listItems.length === 0
    const isStatusSynced = previousStatusRef.current === status

    if (isListEmpty && isFirstRender) {
      loadMore()
    }

    useDidUpdate(() => {
      if (!isStatusSynced && !isListReseted) {
        resetList()
        setIsListReseted(true)
      }
    }, [status, isListReseted])

    useDidUpdate(() => {
      if (!isStatusSynced && queryRef.current) {
        queryRef.current.abort()
        queryRef.current = null
      }

      const isListItemsLessThenLimit = listItems.length < infiniteListState.limit
      const isPossibleToLoadMore = infiniteListState.isCanLoadMore && !infiniteListState.isPending

      if (isListItemsLessThenLimit && isPossibleToLoadMore && !isStatusSynced && isListReseted) {
        previousStatusRef.current = status

        loadMore()
        setIsListReseted(false)
      }
    }, [status, listItems, isListReseted, infiniteListState.isCanLoadMore, infiniteListState.isPending])

    useUnmount(() => queryRef.current?.abort())

    return { ref, listItems, infiniteListState, loadMore, reset: resetList }
  }
