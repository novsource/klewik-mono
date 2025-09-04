import { useRef } from 'react'

import { isAxiosError } from 'axios'

import { useLazyLoadMoreDonationsQuery } from '~features/donations/watch-donations/api'
import { useDonationsInfiniteList } from '~features/donations/watch-donations/hooks'
import type { DonationsInfiniteListProps } from '~features/donations/watch-donations/ui'
import { DonationsInfiniteList } from '~features/donations/watch-donations/ui'

import { auctionSelectors } from '~entities/auction/store'

import type { ProcessedDonation, ProcessedDonationStatus } from '~entities/donation/model'

import { useDidUpdate } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { MotionBox } from '~shared/ui/motion-box'
import { toastErrorNotification } from '~shared/ui/toaster/lib'
import type { VirtualizedItem } from '~shared/ui/virtual-list/hooks'

import { InfinityDonationsListCard } from './donations-list-card.ui'

type AuctionDonationsInfiniteListProps
  = Omit<
    DonationsInfiniteListProps,
'data' | 'listRef' | 'isCanBeLoadMore' | 'isPending' | 'children'
> & {
  data: ProcessedDonation[]
  filterStatus: NullablePossible<ProcessedDonationStatus>
  offset?: number
}

const wait = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms))

export const AuctionDonationsInfiniteList = (props: AuctionDonationsInfiniteListProps) => {
  const {
    data,
    filterStatus,
    offset,
    limit = 15,
    ...restProps
  } = props

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const [loadMoreDonationsQuery] = useLazyLoadMoreDonationsQuery()

  const previousStatusRef = useRef(filterStatus)
  const queryRef = useRef<NullablePossible<ReturnType<typeof loadMoreDonationsQuery>>>(null)

  const loadDonations = async () => {
    try {
      await wait(2000)

      const request = loadMoreDonationsQuery({
        auctionUUID,
        limit,
        order: 'descending',
        status: filterStatus || 'all',
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

      return { list: response.data }
    }
    catch (err) {
      if (isAxiosError(err)) {
        toastErrorNotification(err.message)
      }

      queryRef.current = null

      return { list: [] }
    }
  }

  const {
    ref,
    infiniteListState,
    listItems,
    reset,
  } = useDonationsInfiniteList(loadDonations, data, { limit: 15 })

  useDidUpdate(() => {
    if (filterStatus !== previousStatusRef.current) {
      previousStatusRef.current = filterStatus

      reset()
    }
  }, [filterStatus])

  const renderListItem = (
    donation: ProcessedDonation,
    virtualizeItem: VirtualizedItem,
  ) => {
    return (
      <MotionBox
        key={virtualizeItem.id}
        initial={{ opacity: 0, scaleY: 0.975, scaleX: 0.975 }}
        animate={{ opacity: 1, scaleY: 1, scaleX: 1 }}
        transition={{
          duration: 0.25,
          ease: 'easeInOut',
        }}
      >
        <InfinityDonationsListCard
          donation={donation}
          style={{
            marginTop: virtualizeItem.index !== 0 ? '8px' : '0',
          }}
        />
      </MotionBox>
    )
  }

  return (
    <DonationsInfiniteList
      data={listItems}
      listRef={ref}
      isCanBeLoadMore={infiniteListState.isCanLoadMore}
      isPending={infiniteListState.isPending}
      limit={infiniteListState.limit}
      {...restProps}
    >
      { renderListItem }
    </DonationsInfiniteList>
  )
}
