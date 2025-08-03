import { useRef } from 'react'

import AutoSizer from 'react-virtualized-auto-sizer'

import {
  ShadowScrollArea,
} from '~shared/ui/shadow-scroll-area'
import type { ShadowScrollAreaProps } from '~shared/ui/shadow-scroll-area'
import type { VirtualListProps } from '~shared/ui/virtual-list'
import { VirtualList } from '~shared/ui/virtual-list'

export type ShadowVirtualListProps = VirtualListProps & {
  width?: number
  height?: number
  shadowScrollProps?: Omit<ShadowScrollAreaProps, 'width' | 'height'>
}

const ShadowVirtualList = (
  props: ShadowVirtualListProps,
) => {
  const {
    width,
    height,
    shadowScrollProps,
    scrollElementRef,
    contentWrapperRef,
    ...virtualListProps
  } = props

  const internalScrollElementRef = useRef<HTMLDivElement>(null)
  const internalContentElementRef = useRef<HTMLDivElement>(null)

  const scrollRef = scrollElementRef ?? internalScrollElementRef
  const contentRef = contentWrapperRef ?? internalContentElementRef

  return (
    <AutoSizer>
      {({ width: autoWidth, height: autoHeight }) => {
        return (
          <ShadowScrollArea
            width={width ?? autoWidth}
            height={height ?? autoHeight}
            externalScrollRef={scrollRef}
            externalContentRef={contentRef}
            {...shadowScrollProps}
          >
            <VirtualList
              width={width ?? autoWidth}
              height={height ?? autoHeight}
              scrollElementRef={scrollRef}
              contentWrapperRef={contentRef}
              {...virtualListProps}
            />
          </ShadowScrollArea>
        )
      }}
    </AutoSizer>
  )
}

export { ShadowVirtualList }
