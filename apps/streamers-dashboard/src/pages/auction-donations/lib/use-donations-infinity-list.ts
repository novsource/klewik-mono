import { useEffect, useMemo, useRef } from 'react'

import { isAxiosError } from 'axios'

import { useLazyLoadMoreDonationsQuery } from '~features/donations/watch-donations/api'

import { auctionSelectors } from '~entities/auction/store'

import type { ProcessedDonation, ProcessedDonationStatus } from '~entities/donation/model'
import { donationsActions } from '~entities/donation/store'

import {
  useDidUpdate,
  useInfiniteScroll,
  useIsFirstRender,
} from '~shared/hooks'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { toastErrorNotification } from '~shared/ui/toaster/lib'

const wait = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms))

export const useDonationsInfinityList
  = (donations: ProcessedDonation[], status: NullablePossible<ProcessedDonationStatus>) => {
    const { addDonation } = useActionCreators(donationsActions)

    const auctionInfo = useStoreSelector(auctionSelectors.getAuctionInfo)

    const isFirstRender = useIsFirstRender()
    const [loadMoreDonationsQuery] = useLazyLoadMoreDonationsQuery()

    const queryRef = useRef<NullablePossible<ReturnType<typeof loadMoreDonationsQuery>>>(null)

    const {
      state: infinityScrollState,
      functions: { loadMore, reset: resetList },
    } = useInfiniteScroll<ProcessedDonation>(
      async () => {
        try {
          await wait(2000)

          const request = loadMoreDonationsQuery({
            auctionUUID: auctionInfo.auctionUUID,
            limit: infinityScrollState.limit,
            order: 'descending',
            status: status || 'all',
          })

          queryRef.current = request

          const response = await request

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
      {
        limit: 15,
      },
    )

    const listItems = useMemo(() => {
      return [...donations, ...infinityScrollState.value]
    }, [donations, infinityScrollState.value])

    const isListEmpty = listItems.length === 0

    if (isListEmpty && isFirstRender) {
      loadMore()
    }

    useDidUpdate(() => {
      if (queryRef.current)
        queryRef.current.abort()

      resetList()
    }, [status])

    useEffect(() => () => queryRef.current?.abort())

    return { listItems, infinityScrollState, loadMore, reset: resetList }
  }
