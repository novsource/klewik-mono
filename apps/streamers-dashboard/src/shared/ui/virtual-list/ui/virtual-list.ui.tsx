import type {
  CustomContainerComponentProps,
  CustomItemComponentProps,
  VirtualizerHandle,
  VirtualizerProps,
} from 'virtua'

import { forwardRef, useLayoutEffect, useMemo, useRef } from 'react'
import type { ComponentProps, MutableRefObject, ReactNode } from 'react'

import { Virtualizer } from 'virtua'

export type VirtualizedItem = {
  id: string
  index: number
}

export type VirtualListItemProps = ComponentProps<'div'> & CustomItemComponentProps

const VirtualListItem = forwardRef(
  (props: VirtualListItemProps, extRef: any) => {
    return (
      <div
        data-slot="virtual-list-item"
        ref={extRef}
        {...props}
      />
    )
  },
)

const VirtualListContainer = forwardRef((props: CustomContainerComponentProps, extRef: any) => {
  return <div data-slot="virtual-list" ref={extRef} {...props} />
})

export type VirtualListSlots
  = | 'container'
    | 'item'

export type VirtualListRenderFunction<DataItem>
= (data: DataItem[], virtualizedItem: VirtualizedItem) => ReactNode

export type VirtualListProps<ListDataElement = unknown> = VirtualizerProps & {
  data: ListDataElement[]
  children: VirtualListRenderFunction<ListDataElement>
  estimateSize?: (index: number) => number
  slotsClassNames?: Partial<Record<VirtualListSlots, string>>
  scrollElementRef?: MutableRefObject<NullablePossible<HTMLDivElement>>
  contentWrapperRef?: MutableRefObject<NullablePossible<HTMLDivElement>>
  virtualListRef?: MutableRefObject<NullablePossible<VirtualizerHandle>>
  count?: number
  width?: number
  height?: number
  gap?: number
}

const VirtualList = (props: VirtualListProps) => {
  const {
    width,
    height,
    gap = 4,
    data,
    estimateSize,
    virtualListRef,
    scrollElementRef,
    contentWrapperRef,
    slotsClassNames,
    children,
    ...virtualizerOptions
  } = props
  const internalScrollElementRef = useRef<HTMLDivElement>(null)

  const virtualizedItems = useMemo<VirtualizedItem[]>(() => {
    return Array
      .from({ length: data.length })
      .map((_, index) => ({ id: `virtual-item-${index}`, index }))
  }, [data])

  useLayoutEffect(() => {
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
        width,
        height,
        position: 'relative',
        overflowY: 'auto',
        contain: 'strict',
      }}
    >
      <div data-slot="virtual-list-wrapper" ref={contentWrapperRef}>
        <Virtualizer
          ref={(ref) => {
            if (virtualListRef?.current === null) {
              virtualListRef.current = ref
            }
          }}
          as={VirtualListContainer}
          item={VirtualListItem}
          scrollRef={internalScrollElementRef}
          {...virtualizerOptions}
        >
          {virtualizedItems.map((vItem, index) => {
            return (
              <div
                key={vItem.id}
                style={{ marginTop: index === 0 ? 0 : gap }}
              >
                {children(data, vItem)}
              </div>
            )
          })}
        </Virtualizer>
      </div>

    </div>
  )
}

export { VirtualList }
