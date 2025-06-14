import { MutableRefObject, ReactNode, useEffect, useRef } from 'react'

import {
  VirtualItem,
  VirtualizerOptions,
  useVirtualizer,
} from '@tanstack/react-virtual'

export type VirtualListSlots =
  | 'content'
  | 'contentWrapper'
  | 'container'
  | 'item'

export type VirtualListProps<
  ListElementType extends Element,
  ListDataElement extends unknown,
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
    virtualizedItem: VirtualItem,
    index: number
  ) => ReactNode
  estimateSize?: (index: number) => number
  slotsClassNames?: Partial<Record<VirtualListSlots, string>>
  scrollElementRef?: MutableRefObject<NullablePossible<HTMLDivElement>>
  contentElementRef?: MutableRefObject<NullablePossible<HTMLDivElement>>
  contentWrapperRef?: MutableRefObject<NullablePossible<HTMLDivElement>>
  count?: number
  width?: number
  height?: number
}

const VirtualList = <
  Element extends HTMLElement,
  ListDataElement extends unknown,
>(
  props: VirtualListProps<Element, ListDataElement>
) => {
  const {
    width,
    height,
    count,
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
  }, [internalScrollElementRef])

  return (
    <div
      data-slot="virtual-list-container"
      ref={internalScrollElementRef}
      className={slotsClassNames?.container}
      style={{
        width: width ?? '100%',
        height: height,
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
                data-slot="virtual-list-item"
                data-index={virtualizedItem.index}
                ref={virtualizer.measureElement}
                key={virtualizedItem.key}
                className={slotsClassNames?.item}
              >
                {children(data, virtualizedItem, virtualizedItem.index)}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { VirtualList }
