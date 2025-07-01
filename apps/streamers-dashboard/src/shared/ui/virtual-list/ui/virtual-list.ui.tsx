import type {
  VirtualItem,
  Virtualizer,
  VirtualizerOptions,
} from '@tanstack/react-virtual'

import type { MutableRefObject, ReactNode } from 'react'
import { useEffect, useRef } from 'react'

import {
  useVirtualizer,
} from '@tanstack/react-virtual'

export type VirtualListSlots
  = | 'content'
    | 'contentWrapper'
    | 'container'
    | 'item'

export type VirtualListProps<
  ListElementType extends Element,
  ListDataElement,
> = Omit<
  VirtualizerOptions<HTMLDivElement, ListElementType>,
  | 'count'
  | 'estimateSize'
  | 'getScrollElement'
  | 'observeElementRect'
  | 'observeElementOffset'
  | 'scrollToFn'
> & {
  data: ListDataElement[]
  children: (
    data: ListDataElement[],
    virtualItem: VirtualItem,
    index: number,
    virtualizer: Virtualizer<HTMLDivElement, ListElementType>
  ) => ReactNode
  estimateSize?: (index: number) => number
  slotsClassNames?: Partial<Record<VirtualListSlots, string>>
  scrollElementRef?: MutableRefObject<NullablePossible<HTMLDivElement>>
  contentElementRef?: MutableRefObject<NullablePossible<HTMLDivElement>>
  contentWrapperRef?: MutableRefObject<NullablePossible<HTMLDivElement>>
  count?: number
  width?: number
  height?: number
  gap?: number
}

const VirtualList = <
  Element extends HTMLElement,
  ListDataElement,
>(
  props: VirtualListProps<Element, ListDataElement>,
) => {
  const {
    width,
    height,
    count,
    gap = 0,
    data,
    scrollElementRef,
    contentElementRef,
    contentWrapperRef,
    slotsClassNames,
    estimateSize: inputEstimateSize,
    children,
    ...virtualizerOptions
  } = props

  const internalScrollElementRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: count ?? data.length,
    getScrollElement: () => internalScrollElementRef.current,
    estimateSize: inputEstimateSize ?? (() => 50),
    ...virtualizerOptions,
  })

  useEffect(() => {
    if (scrollElementRef) {
      scrollElementRef.current = internalScrollElementRef.current
    }
  }, [internalScrollElementRef, scrollElementRef])

  return (
    <div
      data-slot="virtual-list-container"
      ref={internalScrollElementRef}
      className={slotsClassNames?.container}
      style={{
        width: width ?? '100%',
        height,
        position: 'relative',
        overflowY: 'auto',
        contain: 'strict',
      }}
    >
      <div
        data-slot="virtual-list-content-wrapper"
        ref={contentWrapperRef}
        className={slotsClassNames?.contentWrapper}
        style={{
          position: 'relative',
          width: '100%',
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        <div
          data-slot="virtual-list-content"
          ref={contentElementRef}
          className={slotsClassNames?.content}
          style={{
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `translateY(${virtualizer.getVirtualItems()[0]?.start ?? 0}px)`,
          }}
        >
          {virtualizer.getVirtualItems().map((virtualizedItem) => {
            return (
              <div
                key={virtualizedItem.key}
                ref={virtualizer.measureElement}
                className={slotsClassNames?.item}
                data-slot="virtual-list-item"
                data-index={virtualizedItem.index}
                style={{ marginTop: virtualizedItem.index !== 0 ? gap : 0 }}
              >
                {children(data, virtualizedItem, virtualizedItem.index, virtualizer)}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { VirtualList }
