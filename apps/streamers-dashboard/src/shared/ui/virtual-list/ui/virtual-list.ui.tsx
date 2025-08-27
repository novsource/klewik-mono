import type {
  CustomContainerComponentProps,
  CustomItemComponentProps,
  VirtualizerHandle,
  VirtualizerProps,
} from 'virtua'

import type { VirtualizedItem } from '../hooks'

import { forwardRef, useMemo, useRef } from 'react'
import type { ComponentProps, MutableRefObject, ReactNode } from 'react'

import { Virtualizer } from 'virtua'

import { isFunction } from '~shared/utils'

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
  children: VirtualListRenderFunction<ListDataElement> | ReactNode | ReactNode[]
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

export const VirtualList = (props: VirtualListProps) => {
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

  const internalScrollRef = useRef<HTMLDivElement>(null)

  const scrollRef = scrollElementRef ?? internalScrollRef

  const virtualizedItems = useMemo<VirtualizedItem[]>(() => {
    return Array
      .from({ length: data.length })
      .map((_, index) => ({ id: `virtual-item-${index}`, index }))
  }, [data])

  return (
    <div
      ref={scrollRef}
      className={slotsClassNames?.container}
      data-slot="virtual-list-container"
      style={{
        width,
        height,
        position: 'relative',
        overflowY: 'auto',
        contain: 'strict',
      }}
    >
      <div ref={contentWrapperRef} data-slot="virtual-list-wrapper">
        <Virtualizer
          ref={(ref) => {
            if (virtualListRef?.current === null) {
              virtualListRef.current = ref
            }
          }}
          as={VirtualListContainer}
          item={VirtualListItem}
          scrollRef={scrollRef}
          {...virtualizerOptions}
        >
          {isFunction(children)
            ? virtualizedItems.map((vItem, index) => {
                return (
                  <div
                    key={vItem.id}
                    style={{ marginTop: index === 0 ? 0 : gap }}
                  >
                    {children(data, vItem)}
                  </div>
                )
              })
            : children}
        </Virtualizer>
      </div>
    </div>
  )
}
