import { useMemo } from 'react'
import type { ReactNode, SVGProps } from 'react'

import type { StateRef, UseInfiniteListReturn } from '~shared/hooks'

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

export type InfiniteListRenderFunction<T> = (item: T, virtualizedItem: VirtualizedItem, extendedListState: ExtendedListState) => ReactNode

export type InfiniteListProps<DataItem> = Omit<
  ShadowVirtualListProps<DataItem>,
  'data' | 'count' | 'scrollElementRef' | 'children'
> & {
  children: InfiniteListRenderFunction<DataItem>
  listRef: StateRef<HTMLElement | Window>
  state: UseInfiniteListReturn<DataItem>['state']
  data?: DataItem[]
  limit?: number
  placeholder?: ReactNode
  showPlaceholders?: boolean
  showEmptyContent?: boolean
  offset?: number
  emptyContentProps?: InfiniteListEmptyContentProps
  loaderProps?: InfiniteListLoaderProps
}

export const InfiniteList = <DataItem = unknown>(props: InfiniteListProps<DataItem>) => {
  const {
    data,
    children,
    listRef,
    state: listState,
    offset,
    placeholder,
    limit = 15,
    showPlaceholders = false,
    showEmptyContent = true,
    emptyContentProps,
    ...restProps
  } = props

  const preparedItems = useMemo(() => {
    if (!data)
      return listState.value

    return data
  }, [data, listState.value])

  /*
    Here we check if we can fit a screen full of cards equal to or greater than the list limit
    If the length of donations is less than the limit, we fill them with empty ones,
    which will subsequently be displayed as skeletons
  */
  const showedItems = useMemo(() => {
    const isDataSizeLessThenLimit = preparedItems.length < limit

    if (showPlaceholders && isDataSizeLessThenLimit) {
      const blankItems = Array.from({ length: limit - preparedItems.length }).fill(null) as Array<null>

      return [...preparedItems, ...blankItems]
    }

    return preparedItems
  }, [showPlaceholders, preparedItems, limit])

  const virtualizedItems = useVirtualizedItems(showedItems)

  const renderVirtualListItem = (
    virtualizeItem: VirtualizedItem,
  ) => {
    const dataItem = showedItems[virtualizeItem.index]
    const isPlaceholderItem = !dataItem

    if (isPlaceholderItem) {
      const gap = restProps.gap ?? 8

      return (
        <div
          key={virtualizeItem.id}
          style={{ marginTop: virtualizeItem.index === 0 ? 0 : gap }}
        >
          {placeholder}
        </div>
      )
    }

    return children(dataItem!, virtualizeItem, { shouldRenderAsSkeleton: isPlaceholderItem })
  }

  const virtualListItemsCount
    = listState.isPending && preparedItems.length < limit
      ? showedItems.length + limit
      : showedItems.length

  const isShouldShowEmptyContent
    = !showedItems.length
      && !listState.isCanLoadMore
      && !listState.isPending
      && showEmptyContent

  const isShouldShowLoader = listState.isPending && preparedItems.length >= limit

  return (
    <ShadowVirtualList
      data={showedItems}
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
