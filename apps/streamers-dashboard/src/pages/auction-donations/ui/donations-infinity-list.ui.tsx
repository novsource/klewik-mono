import { useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { isAxiosError } from 'axios'
import { AnimatePresence } from 'motion/react'

import { useLazyLoadMoreDonationsQuery } from '~features/donations/watch-donations/api'

import { auctionSelectors } from '~entities/auction/store'

import type { ProcessedDonation, ProcessedDonationStatus } from '~entities/donation/model'
import { donationsActions } from '~entities/donation/store'
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

  const auctionInfo = useStoreSelector(auctionSelectors.getAuctionInfo)

  const isFirstRender = useIsFirstRender()
  const [loadMoreDonationsQuery] = useLazyLoadMoreDonationsQuery()

  const {
    state: infinityScrollState,
    functions: { loadMore: fetchMoreDonations, reset: resetInfinityListData },
  } = useInfiniteScroll<ProcessedDonation>(
    async () => {
      try {
        await wait(2000)

        const response = await loadMoreDonationsQuery({
          auctionUUID: auctionInfo.auctionUUID,
          limit: infinityScrollState.limit,
          order: 'descending',
          status: filterStatus ?? 'all',
        })

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
        return { list: [] }
      }
    },
    {
      limit: 15,
    },
  )

  const showedDonations = useMemo(() => {
    return [...data, ...infinityScrollState.value]
  }, [data, infinityScrollState.value])

  const isListEmpty = showedDonations.length === 0

  if (isListEmpty && isFirstRender) {
    fetchMoreDonations()
  }

  const virtualizedItems = useVirtualizedItems(
    showedDonations.length < infinityScrollState.limit
      ? [...data, ...Array.from(
          { length: infinityScrollState.limit - data.length },
        ).fill(null)]
      : showedDonations,
  )

  useDidUpdate(() => {
    resetInfinityListData()
  }, [filterStatus])

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

    const isListLengthLessThenLimit = showedDonations.length < infinityScrollState.limit
    const isVItemBlanked = !showedDonations[virtualizeItem.index]

    const isShouldRenderAsSkeleton = isPending && isListLengthLessThenLimit && isVItemBlanked

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

    if (!isShouldRenderAsSkeleton && isVItemBlanked)
      return

    const donation = showedDonations[virtualizeItem.index]

    return (
      <MotionBox
        key={virtualizeItem.id}
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
      ? showedDonations.length + infinityScrollState.limit
      : showedDonations.length

  const isShouldShowEmptyContent
    = isListEmpty && !infinityScrollState.isCanLoadMore && !infinityScrollState.isPending

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
            data={virtualizedItems}
            count={virtualListItemsCount}
            shadowScrollProps={{
              shadowSize: 30,
            }}
            scrollElementRef={scrollElementRef}
            onScroll={onScrollHandler}
            onScrollEnd={() => setIsScrolling(false)}
          >
            {virtualizedItems.map(renderVirtualListItem)}
            {infinityScrollState.isPending
              && showedDonations.length >= infinityScrollState.limit
              && (
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
