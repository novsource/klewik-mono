'use client'

import { useRef } from 'react'

import { AutoSizer } from 'react-virtualized-auto-sizer'



import {
  ShadowScrollArea,
} from '../../shadow-scroll-area'
import type { ShadowScrollAreaProps } from '../../shadow-scroll-area'
import type { VirtualListProps } from '../../virtual-list'
import { VirtualList } from '../../virtual-list'

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
    ...virtualListProps
  } = props

  const internalScrollRef = useRef<HTMLDivElement>(null)
  const internalContentRef = useRef<HTMLDivElement>(null)

  return (
    <AutoSizer ChildComponent={({ width: autoWidth, height: autoHeight }) => {
      const compWidth = width ?? autoWidth ?? 0
      const compHeight = height ?? autoHeight ?? 0

      return (
        <ShadowScrollArea
          width={compWidth}
          height={compHeight}
          externalScrollRef={internalScrollRef}
          externalContentRef={internalContentRef}
          {...shadowScrollProps}
        >
          <VirtualList
            width={compWidth}
            height={compHeight}
            scrollElementRef={internalScrollRef}
            contentWrapperRef={internalContentRef}
            {...virtualListProps}
          />
        </ShadowScrollArea>
      )
    }}
    />
  )
}

export { ShadowVirtualList }
