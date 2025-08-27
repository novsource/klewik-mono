import { useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { isAxiosError } from 'axios'
import { AnimatePresence } from 'motion/react'

import { useLazyLoadMoreDonationsQuery } from '~features/donations/watch-donations/api'

import { auctionSelectors } from '~entities/auction/store'

import type { ProcessedDonation, ProcessedDonationStatus } from '~entities/donation/model'
import { donationsActions, donationsSelectors } from '~entities/donation/store'
import { DonationCard, SkeletonDonationCard } from '~entities/donation/ui/card'

import { useDidUpdate } from '~shared/hooks'
import { useInfiniteScroll } from '~shared/hooks/use-infinite-scroll'
import { useIsFirstRender } from '~shared/hooks/use-is-first-render'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { MotionBox } from '~shared/ui/motion-box'
import { ShadowVirtualList } from '~shared/ui/shadow-virtual-list'
import { toastErrorNotification } from '~shared/ui/toaster/lib'
import { Typography } from '~shared/ui/typograghy'
import type { VirtualizedItem } from '~shared/ui/virtual-list/hooks'
import { useVirtualizedItems } from '~shared/ui/virtual-list/hooks'

type DonationsInfinityListProps = {
  data: ProcessedDonation[]
  renderDonation?: (donation: ProcessedDonation, index: number) => ReactNode
  filterStatus?: ProcessedDonationStatus | 'all'
  offset?: number
}

const wait = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms))

export const DonationsInfinityList = (props: DonationsInfinityListProps) => {
  const {
    data,
    renderDonation,
    filterStatus,
    offset,
    ...restProps
  } = props

  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollYValue, setScrollYValue] = useState(0)

  const scrollElementRef = useRef<HTMLDivElement>(null)

  const { addDonation } = useActionCreators(donationsActions)

  const donations = useStoreSelector(donationsSelectors.getAllDonations)
  const auctionInfo = useStoreSelector(auctionSelectors.getAuctionInfo)

  const isFirstRender = useIsFirstRender()
  const isDataEmpty = donations.length === 0

  const [loadMoreDonationsQuery] = useLazyLoadMoreDonationsQuery()

  const {
    state: infinityScrollState,
    functions: { loadMore: fetchMoreDonations },
  } = useInfiniteScroll<ProcessedDonation>(
    async () => {
      return new Promise((resolve, reject) => {
        return loadMoreDonationsQuery({
          auctionUUID: auctionInfo.auctionUUID,
          limit: infinityScrollState.limit,
          order: 'descending',
          status: filterStatus ?? 'all',
        }).then((result) => {
          const responseData = result.data

          wait(1000).then(() => {
            if (!responseData || responseData.length === 0) {
              return resolve({ list: [] })
            }

            responseData.forEach(addDonation)
            resolve({ list: responseData })
          })
        }).catch((err) => {
          const errorMessage = 'Ошибка загрузки пожертвований'

          toastErrorNotification(errorMessage)
          reject(isAxiosError(err) ? err.message : errorMessage)
        })
      })
    },
    {
      initial: isDataEmpty && isFirstRender ? Array.from({ length: 15 }) : donations,
      limit: 15,
    },
  )

  if (isDataEmpty && isFirstRender) {
    fetchMoreDonations()
  }

  const virtualizedItems = useVirtualizedItems(infinityScrollState.value)

  useDidUpdate(() => {
    const scrollElement = scrollElementRef.current

    if (!scrollElement)
      return

    const loadOffset = offset ?? 30

    const isEndOfList
      = scrollElement.scrollHeight - (scrollElement.scrollTop + scrollElement.clientHeight + loadOffset) <= 0

    const isPossibleToFetchMore
      = infinityScrollState.isCanLoadMore && !infinityScrollState.isPending

    if (isEndOfList && isPossibleToFetchMore) {
      fetchMoreDonations()
    }
  }, [
    scrollYValue,
    fetchMoreDonations,
    infinityScrollState.isCanLoadMore,
    infinityScrollState.isPending,
    offset,
  ])

  const renderVirtualListItem = (
    virtualizeItem: VirtualizedItem,
  ) => {
    const { isPending } = infinityScrollState

    const isShouldRenderAsSkeleton = isPending && infinityScrollState.value.length <= infinityScrollState.limit

    if (isShouldRenderAsSkeleton) {
      return (
        <SkeletonDonationCard
          key={virtualizeItem.id}
          style={{
            marginTop: virtualizeItem.index !== 0 ? '8px' : '0',
          }}
        />
      )
    }

    if (!infinityScrollState.value[virtualizeItem.index])
      return

    const donation = infinityScrollState.value[virtualizeItem.index]

    return (
      <MotionBox
        key={donation.id}
        initial={{ opacity: isScrolling ? 1 : 0, scaleY: 0.975, scaleX: 0.975 }}
        animate={{ opacity: 1, scaleY: 1, scaleX: 1 }}
        transition={{
          duration: isScrolling ? 0 : 0.25,
          ease: 'easeInOut',
        }}
      >
        {renderDonation
          ? renderDonation(donation, virtualizeItem.index)
          : <DonationCard data={donation} />}
      </MotionBox>
    )
  }

  const virtualListItemsCount
    = infinityScrollState.isPending
      ? infinityScrollState.value.length + infinityScrollState.limit
      : infinityScrollState.value.length

  const isShouldShowEmptyContent
    = isDataEmpty && !infinityScrollState.isCanLoadMore && !infinityScrollState.isPending

  const onScrollHandler = (scrollValue: number) => {
    setIsScrolling(true)
    setScrollYValue(scrollValue)
  }

  return (
    <Flex className="h-full w-full" {...restProps}>
      <AnimatePresence>
        {isShouldShowEmptyContent && <EmptyDonationsList />}
        {!isShouldShowEmptyContent && (
          <ShadowVirtualList
            slotsClassNames={{ container: 'pb-4' }}
            data={infinityScrollState.value}
            count={virtualListItemsCount}
            scrollElementRef={scrollElementRef}
            onScroll={onScrollHandler}
            onScrollEnd={() => setIsScrolling(false)}
          >
            {virtualizedItems.map(renderVirtualListItem)}
            {infinityScrollState.isPending && (
              <MotionBox
                className="flex w-full pt-10 gap-x-2 justify-center items-center text-gray"
                initial={{ scale: 1.15, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ease: 'easeInOut', duration: 0.3 }}
              >
                <MotionBox
                  initial={{ rotateZ: -180 }}
                  animate={{ rotateZ: 0 }}
                  transition={{ repeat: Infinity, type: 'spring', duration: 1.25 }}
                >
                  <Icons.Logo width={38} height={38} />
                </MotionBox>
              </MotionBox>
            )}
          </ShadowVirtualList>
        )}
      </AnimatePresence>

    </Flex>
  )
}

function EmptyDonationsList() {
  return (
    <Flex className="fixed w-full h-full top-0 left-0 -z-40" align="center" justify="center">
      <MotionBox
        className="flex flex-col items-center gap-y-1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <Icons.Logo width={32} height={32} className="text-gray" />
        <Typography tag="span" className="font-medium text-gray">
          Донаты не были найдены
        </Typography>
      </MotionBox>
    </Flex>
  )
}
