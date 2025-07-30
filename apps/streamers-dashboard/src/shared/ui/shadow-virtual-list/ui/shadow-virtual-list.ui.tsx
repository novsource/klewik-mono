import { useRef } from 'react'

import AutoSizer from 'react-virtualized-auto-sizer'

import {
  ShadowScrollArea,
} from '~shared/ui/shadow-scroll-area'
import type { ShadowScrollAreaProps } from '~shared/ui/shadow-scroll-area'
import type { VirtualListProps } from '~shared/ui/virtual-list'
import { VirtualList } from '~shared/ui/virtual-list'

export type ShadowVirtualListProps = VirtualListProps & {
  className?: string
  shadowScrollProps?: ShadowScrollAreaProps
}

const ShadowVirtualList = (
  props: ShadowVirtualListProps,
) => {
  const { className, shadowScrollProps, scrollElementRef, contentWrapperRef, ...virtualListProps } = props

  const internalScrollElementRef = useRef<HTMLDivElement>(null)
  const internalContentElementRef = useRef<HTMLDivElement>(null)

  const scrollRef = scrollElementRef ?? internalScrollElementRef
  const contentRef = contentWrapperRef ?? internalContentElementRef

  return (
    <AutoSizer className={className}>
      {({ width, height }) => {
        return (
          <ShadowScrollArea
            width={width}
            height={height}
            externalScrollRef={scrollRef}
            externalContentRef={contentRef}
            {...shadowScrollProps}
          >
            <VirtualList
              width={width}
              height={height}
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
