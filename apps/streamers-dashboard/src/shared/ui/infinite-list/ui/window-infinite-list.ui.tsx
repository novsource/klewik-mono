import type { ExtendedListState } from './infinite-list.ui'

import { useMemo } from 'react'
import type { ReactNode, SVGProps } from 'react'

import type { UseInfiniteListReturn } from '~shared/hooks'

import type { FlexProps } from '~shared/ui/flex'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import type { MotionBoxProps } from '~shared/ui/motion-box'
import { MotionBox } from '~shared/ui/motion-box'
import { Typography } from '~shared/ui/typograghy'
import type { WindowVirtualListProps } from '~shared/ui/virtual-list'
import { WindowVirtualList } from '~shared/ui/virtual-list'
import { useVirtualizedItems } from '~shared/ui/virtual-list/hooks'
import type { VirtualizedItem } from '~shared/ui/virtual-list/hooks'

import { cn } from '~shared/utils'

import { infiniteListEmptyContentStyles, infiniteListLoaderStyles } from '../styles'

export type WindowInfiniteListRenderFunction<T> = (item: T, virtualizedItem: VirtualizedItem, extendedListState: ExtendedListState) => ReactNode

export type WindowInfiniteListProps<DataItem> = Omit<
  WindowVirtualListProps<DataItem>,
  'data' | 'count' | 'children'
> & Pick<UseInfiniteListReturn<DataItem>, 'state'> & {
  children: WindowInfiniteListRenderFunction<DataItem>
  data?: DataItem[]
  limit?: number
  placeholder?: ReactNode
  showPlaceholders?: boolean
  showEmptyContent?: boolean
  emptyContentProps?: InfiniteListEmptyContentProps
  loaderProps?: InfiniteListLoaderProps
}

export const WindowInfiniteList = <DataItem = unknown>(props: WindowInfiniteListProps<DataItem>) => {
  const {
    data,
    children,
    state: listState,
    placeholder,
    gap = 8,
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
    <WindowVirtualList
      data={showedItems}
      count={virtualListItemsCount}
      {...restProps}
    >
      {isShouldShowEmptyContent && <InfiniteListEmptyContent {...emptyContentProps} />}
      {virtualizedItems.map(renderVirtualListItem)}
      {isShouldShowLoader && <InfiniteListLoader />}
    </WindowVirtualList>
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
