import type { ProcessedDonation, ProcessedDonationStatus } from '~entities/donation/model'
import { SkeletonDonationCard } from '~entities/donation/ui/card'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { MotionBox } from '~shared/ui/motion-box'
import { ShadowVirtualList } from '~shared/ui/shadow-virtual-list'
import { Typography } from '~shared/ui/typograghy'
import { useVirtualizedItems } from '~shared/ui/virtual-list/hooks'
import type { VirtualizedItem } from '~shared/ui/virtual-list/hooks'

import { useDonationsInfinityList } from '../lib'
import { InfinityDonationsListCard } from './donations-list-card.ui'

type DonationsInfinityListProps = {
  data: ProcessedDonation[]
  filterStatus: NullablePossible<ProcessedDonationStatus>
  offset?: number
}

export const DonationsInfinityList = (props: DonationsInfinityListProps) => {
  const { data, filterStatus, offset, ...restProps } = props

  const {
    ref: scrollElementRef,
    infiniteListState,
    listItems,
  } = useDonationsInfinityList(data, filterStatus, { limit: 15 })

  /*
    Here we check if we can fit a screen full of cards equal to or greater than the list limit
    If the length of donations is less than the limit, we fill them with empty ones,
    which will subsequently be displayed as skeletons
  */
  const virtualizedItems = useVirtualizedItems(
    listItems.length < infiniteListState.limit
      ? [...listItems, ...Array.from(
          { length: infiniteListState.limit - listItems.length },
        ).fill(null)]
      : listItems,
  )

  const renderVirtualListItem = (
    virtualizeItem: VirtualizedItem,
  ) => {
    const { isPending } = infiniteListState

    const isListLengthLessThenLimit = listItems.length < infiniteListState.limit
    const isVItemBlanked = !listItems[virtualizeItem.index]

    const isShouldRenderAsSkeleton = isPending && isListLengthLessThenLimit && isVItemBlanked

    if (isShouldRenderAsSkeleton) {
      return (
        <MotionBox
          key={virtualizeItem.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          withAnimatePresense
        >
          <SkeletonDonationCard
            key={virtualizeItem.id}
            style={{
              marginTop: virtualizeItem.index !== 0 ? '8px' : '0',
            }}
          />
        </MotionBox>
      )
    }

    if (!isShouldRenderAsSkeleton && isVItemBlanked)
      return

    const donation = listItems[virtualizeItem.index]

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

  const virtualListItemsCount
    = infiniteListState.isPending
      ? listItems.length + infiniteListState.limit
      : listItems.length

  const isShouldShowEmptyContent
    = !listItems.length && !infiniteListState.isCanLoadMore && !infiniteListState.isPending

  return (
    <Flex className="h-full w-full" {...restProps}>
      <ShadowVirtualList
        slotsClassNames={{ container: 'pb-4' }}
        data={listItems}
        count={virtualListItemsCount}
        scrollElementRef={scrollElementRef}
        shadowScrollProps={{
          shadowSize: 30,
        }}
      >
        {isShouldShowEmptyContent && <EmptyDonationsList />}
        {virtualizedItems.map(renderVirtualListItem)}
        {infiniteListState.isPending
          && listItems.length >= infiniteListState.limit
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
