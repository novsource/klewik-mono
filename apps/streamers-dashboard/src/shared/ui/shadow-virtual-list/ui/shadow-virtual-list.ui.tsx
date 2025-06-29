import { useRef } from 'react'

import AutoSizer from 'react-virtualized-auto-sizer'

import type {
  ShadowScrollAreaProps,
} from '~shared/ui/shadow-scroll-area'
import {
  ShadowScrollArea,
} from '~shared/ui/shadow-scroll-area'
import type { VirtualListProps } from '~shared/ui/virtual-list'
import { VirtualList } from '~shared/ui/virtual-list'

export type ShadowVirtualListProps<
  Element extends HTMLElement,
  ListDataItem,
> = VirtualListProps<Element, ListDataItem> & {
  className?: string
  shadowScrollProps?: ShadowScrollAreaProps
}

const ShadowVirtualList = <
  Element extends HTMLElement,
  ListDataElement = unknown,
>(
  props: ShadowVirtualListProps<Element, ListDataElement>,
) => {
  const { className, shadowScrollProps, ...virtualListProps } = props

  const internalScrollElementRef = useRef<HTMLDivElement>(null)
  const internalContentElementRef = useRef<HTMLDivElement>(null)

  return (
    <AutoSizer className={className}>
      {({ width, height }) => {
        return (
          <ShadowScrollArea
            externalScrollRef={internalScrollElementRef}
            externalContentRef={internalContentElementRef}
            style={{ width, height }}
            {...shadowScrollProps}
          >
            <VirtualList
              width={width}
              height={height}
              scrollElementRef={internalScrollElementRef}
              contentWrapperRef={internalContentElementRef}
              {...virtualListProps}
            />
          </ShadowScrollArea>
        )
      }}
    </AutoSizer>
  )
}

export { ShadowVirtualList }
