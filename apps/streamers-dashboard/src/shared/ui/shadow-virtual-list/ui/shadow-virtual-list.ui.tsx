import { useMemo, useRef } from 'react'

import AutoSizer from 'react-virtualized-auto-sizer'

import { useMergedRefs } from '~shared/hooks'

import {
  ShadowScrollArea,
} from '~shared/ui/shadow-scroll-area'
import type { ShadowScrollAreaProps } from '~shared/ui/shadow-scroll-area'
import type { VirtualListProps } from '~shared/ui/virtual-list'
import { VirtualList } from '~shared/ui/virtual-list'

export type ShadowVirtualListProps<T> = VirtualListProps<T> & {
  width?: number
  height?: number
  shadowScrollProps?: Omit<ShadowScrollAreaProps, 'width' | 'height'>
}

const ShadowVirtualList = <T = unknown>(
  props: ShadowVirtualListProps<T>,
) => {
  const {
    width,
    height,
    shadowScrollProps,
    scrollElementRef,
    contentWrapperRef,
    ...virtualListProps
  } = props

  const internalScrollRef = useRef<HTMLDivElement>(null)
  const internalListWrapperRef = useRef<HTMLDivElement>(null)

  const contentRef = contentWrapperRef ?? internalListWrapperRef

  const scrollRefs = useMemo(() => [internalScrollRef, scrollElementRef], [scrollElementRef])
  const scrollRefCallback = useMergedRefs(...scrollRefs)

  return (
    <AutoSizer>
      {({ width: autoWidth, height: autoHeight }) => {
        return (
          <ShadowScrollArea
            width={width ?? autoWidth}
            height={height ?? autoHeight}
            externalScrollRef={internalScrollRef}
            externalContentRef={contentRef}
            {...shadowScrollProps}
          >
            <VirtualList
              width={width ?? autoWidth}
              height={height ?? autoHeight}
              scrollElementRef={scrollRefCallback}
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
