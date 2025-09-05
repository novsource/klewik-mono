import { useMemo } from 'react'
import type { ReactNode, SVGProps } from 'react'

import type { ProcessedDonation } from '~entities/donation/model'

import type { StateRef } from '~shared/hooks'

import type { FlexProps } from '~shared/ui/flex'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import type { MotionBoxProps } from '~shared/ui/motion-box'
import { MotionBox } from '~shared/ui/motion-box'
import type { ShadowVirtualListProps } from '~shared/ui/shadow-virtual-list'
import { ShadowVirtualList } from '~shared/ui/shadow-virtual-list'
import { Typography } from '~shared/ui/typograghy'
import { useVirtualizedItems } from '~shared/ui/virtual-list/hooks'
import type { VirtualizedItem } from '~shared/ui/virtual-list/hooks'

import { cn } from '~shared/utils'

import { infiniteListEmptyContentStyles, infiniteListLoaderStyles } from '../styles'

export type ExtendedListState = {
  shouldRenderAsSkeleton: boolean
}

export type InfiniteListProps<T> = Omit<
  ShadowVirtualListProps<ProcessedDonation>,
  'data' | 'count' | 'scrollElementRef'
> & {
  data: T[]
  children: (donation: T, virtualizedItem: VirtualizedItem, extendedListState: ExtendedListState) => ReactNode
  listRef: StateRef<HTMLDivElement>
  limit?: number
  offset?: number
  isPending?: boolean
  isCanBeLoadMore?: boolean
  blankFillingOnPending?: boolean
  emptyContentProps?: InfiniteListEmptyContentProps
  loaderProps?: InfiniteListLoaderProps
}

export const InfiniteList = <T = unknown>(props: InfiniteListProps<T>) => {
  const {
    data,
    limit = 15,
    offset,
    isPending = false,
    isCanBeLoadMore = false,
    blankFillingOnPending: blankFillingByLimit = true,
    children,
    listRef,
    emptyContentProps,
    ...restProps
  } = props

  /*
    Here we check if we can fit a screen full of cards equal to or greater than the list limit
    If the length of donations is less than the limit, we fill them with empty ones,
    which will subsequently be displayed as skeletons
  */
  const showedItems = useMemo(() => {
    const isDataSizeLessThenLimit = data.length < limit

    if (blankFillingByLimit && isDataSizeLessThenLimit) {
      const blankItems = Array.from({ length: limit - data.length }).fill(null)

      return [...data, ...blankItems]
    }

    return data
  }, [blankFillingByLimit, data, limit])

  const virtualizedItems = useVirtualizedItems(showedItems)

  const renderVirtualListItem = (
    virtualizeItem: VirtualizedItem,
  ) => {
    const isListLengthLessThenLimit = data.length < limit
    const isVirtualizedItemBlanked = !data[virtualizeItem.index]

    const isShouldRenderItemAsSkeleton = isPending && isListLengthLessThenLimit && isVirtualizedItemBlanked

    if (!isShouldRenderItemAsSkeleton && isVirtualizedItemBlanked)
      return

    const donation = data[virtualizeItem.index]

    return children(donation, virtualizeItem, { shouldRenderAsSkeleton: isShouldRenderItemAsSkeleton })
  }

  const virtualListItemsCount = isPending ? data.length + limit : data.length

  const isShouldShowEmptyContent = !data.length && !isCanBeLoadMore && !isPending
  const isShouldShowLoader = isPending && data.length >= limit

  return (
    <ShadowVirtualList
      data={data}
      count={virtualListItemsCount}
      scrollElementRef={listRef}
      {...restProps}
    >
      {isShouldShowEmptyContent && <InfiniteListEmptyContent {...emptyContentProps} />}
      {virtualizedItems.map(renderVirtualListItem)}
      {isShouldShowLoader && <InfiniteListLoader />}
    </ShadowVirtualList>
  )
}

type InfiniteListEmptyContentProps = Omit<FlexProps, 'children'> & {
  placeholder?: string
}

function InfiniteListEmptyContent(props: InfiniteListEmptyContentProps) {
  const { className, placeholder, ...restProps } = props

  const styles = useMemo(() => cn(infiniteListEmptyContentStyles(), className), [className])

  return (
    <Flex
      className={styles}
      align="center"
      justify="center"
      {...restProps}
    >
      <MotionBox
        className="flex flex-col items-center gap-y-1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <Icons.Logo width={32} height={32} className="text-gray" />
        <Typography tag="span" className="font-medium text-gray">
          {placeholder ?? 'Empty list'}
        </Typography>
      </MotionBox>
    </Flex>
  )
}

type InfiniteListLoaderProps = MotionBoxProps & {
  logoProps?: SVGProps<SVGSVGElement>
}

function InfiniteListLoader(props: InfiniteListLoaderProps) {
  const { className, logoProps, ...restProps } = props

  const styles = useMemo(() => cn(infiniteListLoaderStyles(), className), [className])

  return (
    <MotionBox
      className={styles}
      initial={{ scale: 1.15, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ ease: 'easeInOut', duration: 0.3 }}
      {...restProps}
    >
      <MotionBox
        initial={{ rotateZ: -180 }}
        animate={{ rotateZ: 0 }}
        transition={{ repeat: Infinity, type: 'spring', duration: 1.25 }}
      >
        <Icons.Logo width={38} height={38} {...logoProps} />
      </MotionBox>
    </MotionBox>
  )
}
