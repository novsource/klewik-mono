import { useRef, useState } from 'react'

import { isAxiosError } from 'axios'

import { useLazyLoadMoreDonationsQuery } from '~features/donations/watch-donations/api'
import { useDonationsInfiniteList } from '~features/donations/watch-donations/hooks'
import type { DonationsInfiniteListProps } from '~features/donations/watch-donations/ui'
import { DonationsInfiniteList } from '~features/donations/watch-donations/ui'

import { auctionSelectors } from '~entities/auction/store'

import type { ProcessedDonation, ProcessedDonationStatus } from '~entities/donation/model'
import { donationsActions } from '~entities/donation/store'
import { SkeletonDonationCard } from '~entities/donation/ui/card'

import { useDidUpdate, useUnmount } from '~shared/hooks'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import type { InfiniteListRenderFunction } from '~shared/ui/infinite-list'
import { MotionBox } from '~shared/ui/motion-box'

import { InfinityDonationsListCard } from './donations-list-card.ui'

export type AuctionDonationsInfiniteListProps
  = Omit<
    DonationsInfiniteListProps,
'data' | 'listRef' | 'isCanBeLoadMore' | 'isPending' | 'children' | 'state'
> & {
  data: ProcessedDonation[]
  filterStatus: NullablePossible<ProcessedDonationStatus>
  offset?: number
}

export const AuctionDonationsInfiniteList = (props: AuctionDonationsInfiniteListProps) => {
  const {
    data,
    filterStatus,
    offset,
    limit = 15,
    ...restProps
  } = props

  const [isShowingSkeletons, setIsShowingSkeletons] = useState(false)

  const { addDonation } = useActionCreators(donationsActions)
  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const [loadMoreDonationsQuery] = useLazyLoadMoreDonationsQuery()

  const previousStatusRef = useRef(filterStatus)
  const lastDonationIdRef = useRef<NullablePossible<number>>(data[data.length - 1]?.id ?? null)
  const queryRef = useRef<NullablePossible<ReturnType<typeof loadMoreDonationsQuery>>>(null)

  const loadDonations = async () => {
    try {
      setIsShowingSkeletons(true)

      const request = loadMoreDonationsQuery({
        auctionUUID,
        limit,
        after: lastDonationIdRef.current || 0,
        order: 'descending',
        status: filterStatus || 'all',
      })

      queryRef.current = request
      const response = await request
      queryRef.current = null

      setIsShowingSkeletons(false)

      if (response.isError) {
        throw response.error
      }

      const responseData = response.data

      if (!response || !responseData) {
        return { list: [] }
      }

      lastDonationIdRef.current
        = responseData[responseData.length - 1]
          ? responseData[responseData.length - 1].id
          : lastDonationIdRef.current

      addDonation(responseData)

      return { list: responseData }
    }
    catch (err) {
      queryRef.current = null
      setIsShowingSkeletons(false)

      if (isAxiosError(err)) {
        throw new Error(err.message)
      }

      if (err instanceof Error) {
        throw err
      }
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
      lastDonationIdRef.current = data[data.length - 1]?.id

      queryRef.current?.abort()

      reset()
    }
  }, [filterStatus])

  useUnmount(() => queryRef.current?.abort())

  const renderListItem: InfiniteListRenderFunction<ProcessedDonation> = (
    donation,
    virtualizeItem,
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
      slotsClassNames={{ container: 'pb-4' }}
      data={listItems}
      state={infiniteListState}
      listRef={ref}
      gap={8}
      placeholder={<SkeletonDonationCard />}
      showPlaceholders={isShowingSkeletons}
      {...restProps}
    >
      { renderListItem }
    </DonationsInfiniteList>
  )
}
