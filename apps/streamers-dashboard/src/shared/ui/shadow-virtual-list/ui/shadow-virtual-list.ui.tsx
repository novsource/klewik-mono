import type { ShadowScrollAreaProps } from 'klewik-ui/shadow-scroll-area'
import type { VirtualListProps } from 'klewik-ui/virtual-list'

import { useRef } from 'react'

import { AutoSizer } from 'react-virtualized-auto-sizer'

import {
  ShadowScrollArea,
} from 'klewik-ui/shadow-scroll-area'
import { VirtualList } from 'klewik-ui/virtual-list'

import { useMergedRefs } from '~shared/hooks'

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
  const internalContentRef = useRef<HTMLDivElement>(null)

  const contentMergedRef = useMergedRefs(internalContentRef, contentWrapperRef)
  const scrollMergedRef = useMergedRefs(internalScrollRef, scrollElementRef)

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
