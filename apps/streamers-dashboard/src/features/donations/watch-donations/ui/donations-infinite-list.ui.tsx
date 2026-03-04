import type { ProcessedDonation } from '~entities/donation/model'
import { SkeletonDonationCard, SolidDonationCard } from '~entities/donation/ui/card'

import type { FlexProps } from '~shared/ui/flex'
import { WindowInfiniteList } from '~shared/ui/infinite-list'
import type { InfiniteListRenderFunction, WindowInfiniteListProps } from '~shared/ui/infinite-list'
import { MotionBox } from '~shared/ui/motion-box'

import { isFunction } from '~shared/utils'

export type DonationsInfiniteListProps = Omit<WindowInfiniteListProps<ProcessedDonation>, 'children'> & {
  listContainerProps?: Omit<FlexProps, 'children'>
  children?: InfiniteListRenderFunction<ProcessedDonation>
  onScroll?: () => void
}

export const DonationsInfiniteList = (props: DonationsInfiniteListProps) => {
  const { listContainerProps, children, ...infiniteListProps } = props

  const renderDefaultDonation: InfiniteListRenderFunction<ProcessedDonation> = (
    donation,
    virtualizeItem,
    state,
  ) => {
    if (state.shouldRenderAsSkeleton) {
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
        <SolidDonationCard donation={donation} />
      </MotionBox>
    )
  }

  // if (isLargeThenTablet) {
  //   return (
  //     <Flex className={cn('h-full w-full', listContainerProps?.className)} {...listContainerProps}>
  //       <InfiniteList listRef={listRef} {...infiniteListProps}>
  //         {isFunction(children) ? children : renderDefaultDonation}
  //       </InfiniteList>
  //     </Flex>
  //   )
  // }

  return (
    <WindowInfiniteList {...infiniteListProps}>
      {isFunction(children) ? children : renderDefaultDonation}
    </WindowInfiniteList>
  )
}
