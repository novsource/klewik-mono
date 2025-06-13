import { ComponentProps, ReactNode, memo, useMemo } from 'react'

import { motion } from 'framer-motion'

import { auctionSelectors } from '~entities/auction/store'

import { ProcessedDonation } from '~entities/donation/model'
import { donationsActions, donationsSelectors } from '~entities/donation/store'
import { DonationCard, SkeletonDonationCard } from '~entities/donation/ui/card'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { useInfiniteScroll } from '~shared/hooks/use-infinite-scroll'
import { useIsFirstRender } from '~shared/hooks/use-is-first-render'

import { Flex } from '~shared/ui/flex'
import { ShadowVirtualList } from '~shared/ui/shadow-virtual-list'

import { useLazyLoadMoreDonationsQuery } from '../api'

type DonationListProps = ComponentProps<'div'> & {
  data?: ProcessedDonation[]
  disableAnimation?: boolean
  renderDonation?: (donation: ProcessedDonation, index: number) => ReactNode
  loader?: ReactNode
}

const DonationsList = memo((props: DonationListProps) => {
  const {
    data,
    className,
    disableAnimation,
    renderDonation,
    loader,
    ...restProps
  } = props

  const { addDonation } = useActionCreators(donationsActions)

  const auctionInfo = useStoreSelector(auctionSelectors.getAuctionInfo)
  const storeDonations = useStoreSelector(donationsSelectors.getAllDonations)

  const donations = useMemo(
    () => data ?? storeDonations,
    [data, storeDonations]
  )

  const [loadMoreDonationsQuery] = useLazyLoadMoreDonationsQuery()

  const {
    state: {
      data: infinityScrollData,
      isPending,
      isCanLoadMore,
      page,
      pageLimit,
    },
    functions: { loadMore: fetchMoreDonations },
  } = useInfiniteScroll<ProcessedDonation>(
    async ({ currentPage, limit }) => {
      return new Promise((resolve) => {
        return loadMoreDonationsQuery({
          auctionUUID: auctionInfo.auctionUUID,
          page: currentPage,
          limit,
        }).then((result) => {
          const donations = result.data

          if (!donations || donations.length === 0) {
            return resolve({ list: [] })
          }

          donations.forEach(addDonation)
          setTimeout(() => resolve({ list: donations }), 3000)
        })
      })
    },
    { initData: donations, pageLimit: 15 }
  )

  const virtualListItemsCount = isPending ? 15 : infinityScrollData.length + 1

  return (
    <Flex className="w-full h-full" {...restProps}>
      <ShadowVirtualList
        data={infinityScrollData}
        count={virtualListItemsCount}
        slotsClassNames={{ content: 'pb-4' }}
        overscan={5}
      >
        {(data, virtualizeItem, index) => {
          if (
            virtualizeItem.index === infinityScrollData.length &&
            isCanLoadMore &&
            !isPending
          ) {
            fetchMoreDonations({ currentPage: page, limit: pageLimit })
          }

          if (isPending) {
            return (
              <SkeletonDonationCard
                key={virtualizeItem.key}
                style={{
                  marginTop: index !== 0 ? '8px' : '0',
                }}
              />
            )
          }

          if (!data[index]) return

          const donation = data[index] as (typeof donations)[number]

          if (renderDonation) {
            return renderDonation(donation, index)
          }

          return (
            <motion.li
              key={donation.id}
              initial={disableAnimation ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: disableAnimation ? 0 : 0.5,
                ease: 'easeIn',
              }}
            >
              <DonationCard data={donation} />
            </motion.li>
          )
        }}
      </ShadowVirtualList>
    </Flex>
  )
})

export { DonationsList }
