import { ComponentProps, ReactNode, memo, useEffect, useState } from 'react'

import { VirtualItem } from '@tanstack/react-virtual'
import * as m from 'motion/react-m'

import { auctionSelectors } from '~entities/auction/store'

import { ProcessedDonation } from '~entities/donation/model'
import { donationsActions } from '~entities/donation/store'
import { DonationCard, SkeletonDonationCard } from '~entities/donation/ui/card'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { useInfiniteScroll } from '~shared/hooks/use-infinite-scroll'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { ShadowVirtualList } from '~shared/ui/shadow-virtual-list'
import { toastErrorNotification } from '~shared/ui/toaster/lib'
import { Typography } from '~shared/ui/typograghy'

import { useLazyLoadMoreDonationsQuery } from '../api'

type DonationListProps = ComponentProps<'div'> & {
  data: ProcessedDonation[]
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

  const [loadMoreDonationsQuery] = useLazyLoadMoreDonationsQuery()

  const {
    state: { fetchedData, isPending, isCanLoadMore, page, pageLimit },
    functions: { loadMore: fetchMoreDonations },
  } = useInfiniteScroll<ProcessedDonation>(
    async ({ currentPage, limit }) => {
      return new Promise((resolve, reject) => {
        const afterId = (currentPage - 1) * limit

        return loadMoreDonationsQuery({
          auctionUUID: auctionInfo.auctionUUID,
          limit,
          after: afterId,
          order: 'desc',
        })
          .then((result) => {
            const donations = result.data

            setTimeout(() => {
              if (!donations || donations.length === 0) {
                return resolve({ list: [] })
              }

              donations.forEach(addDonation)
              resolve({ list: donations })
            }, 3000)
          })
          .catch(() => {
            toastErrorNotification('Не удалось загрузить больше пожертвований')
            reject()
          })
      })
    },
    { externalDataSource: data, pageLimit: 15 }
  )

  const [donationsListData, setDonationsListData] = useState(() => data)

  useEffect(() => {
    if (fetchedData) {
      setDonationsListData((curr) => [...curr, ...fetchedData])
    }
  }, [fetchedData])

  const virtualListItemsCount = isPending ? 15 : donationsListData.length + 1

  const renderVirtualListItem = (
    listData: ProcessedDonation[],
    virtualizeItem: VirtualItem,
    index: number
  ) => {
    if (
      virtualizeItem.index === donationsListData.length &&
      isCanLoadMore &&
      !isPending
    ) {
      fetchMoreDonations({ currentPage: page, limit: pageLimit })
    }

    if (!isPending && !isCanLoadMore && donationsListData.length === 0)
      return <EmptyDonationsList />

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

    if (!listData[index]) return

    const donation = listData[index]

    if (renderDonation) {
      return renderDonation(donation, index)
    }

    return (
      <m.li
        key={donation.id}
        initial={disableAnimation ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: disableAnimation ? 0 : 0.5,
          ease: 'easeIn',
        }}
      >
        <DonationCard data={donation} />
      </m.li>
    )
  }

  return (
    <Flex className="h-full w-full" {...restProps}>
      <ShadowVirtualList
        data={donationsListData}
        count={virtualListItemsCount}
        slotsClassNames={{ content: 'pb-4' }}
        overscan={5}
      >
        {renderVirtualListItem}
      </ShadowVirtualList>
    </Flex>
  )
})

const EmptyDonationsList = () => {
  return (
    <Flex className="h-screen w-full" align="center" justify="center">
      <Flex className="gap-y-1" direction="column" align="center">
        <Icons.Logo width={32} height={32} className="text-gray" />
        <Typography tag="h3" className="font-medium text-gray">
          Донаты не были найдены
        </Typography>
      </Flex>
    </Flex>
  )
}

export { DonationsList }
