import type { ReactNode } from 'react'

import type { ProcessedDonation } from '~entities/donation/model'
import { SkeletonDonationCard } from '~entities/donation/ui/card'

import type { StateRef } from '~shared/hooks'

import type { FlexProps } from '~shared/ui/flex'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { MotionBox } from '~shared/ui/motion-box'
import type { ShadowVirtualListProps } from '~shared/ui/shadow-virtual-list'
import { ShadowVirtualList } from '~shared/ui/shadow-virtual-list'
import { Typography } from '~shared/ui/typograghy'
import { useVirtualizedItems } from '~shared/ui/virtual-list/hooks'
import type { VirtualizedItem } from '~shared/ui/virtual-list/hooks'

import { cn } from '~shared/utils'

export type DonationsInfiniteListProps = Omit<FlexProps, 'children'> & {
  data: ProcessedDonation[]
  children: (donation: ProcessedDonation, virtualizedItem: VirtualizedItem) => ReactNode
  listRef: StateRef<HTMLDivElement>
  limit?: number
  offset?: number
  isPending?: boolean
  isCanBeLoadMore?: boolean
  shadowVirtualListProps?: Omit<
    ShadowVirtualListProps<ProcessedDonation>,
    'data' | 'count' | 'scrollElementRef'
  >
}

export const DonationsInfiniteList = (props: DonationsInfiniteListProps) => {
  const {
    className,
    data,
    limit = 15,
    offset,
    isPending = false,
    isCanBeLoadMore = false,
    children,
    listRef,
    shadowVirtualListProps,
    ...restProps
  } = props

  /*
    Here we check if we can fit a screen full of cards equal to or greater than the list limit
    If the length of donations is less than the limit, we fill them with empty ones,
    which will subsequently be displayed as skeletons
  */
  const virtualizedItems = useVirtualizedItems(
    data.length < limit
      ? [...data, ...Array.from(
          { length: limit - data.length },
        ).fill(null)]
      : data,
  )

  const renderVirtualListItem = (
    virtualizeItem: VirtualizedItem,
  ) => {
    const isListLengthLessThenLimit = data.length < limit
    const isVItemBlanked = !data[virtualizeItem.index]

    const isShouldRenderAsSkeleton = isPending && isListLengthLessThenLimit && isVItemBlanked

    if (!isShouldRenderAsSkeleton && isVItemBlanked)
      return

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

    const donation = data[virtualizeItem.index]

    return children(donation, virtualizeItem)
  }

  const virtualListItemsCount = isPending ? data.length + limit : data.length

  const isShouldShowEmptyContent = !data.length && !isCanBeLoadMore && !isPending

  return (
    <Flex className={cn('h-full w-full', className)} {...restProps}>
      <ShadowVirtualList
        slotsClassNames={{ container: 'pb-4' }}
        data={data}
        count={virtualListItemsCount}
        scrollElementRef={listRef}
        shadowScrollProps={{
          shadowSize: 30,
        }}
        {...shadowVirtualListProps}
      >
        {isShouldShowEmptyContent && <EmptyDonationsList />}
        {virtualizedItems.map(renderVirtualListItem)}
        {isPending && data.length >= limit && (
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
