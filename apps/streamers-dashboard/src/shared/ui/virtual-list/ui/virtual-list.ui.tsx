import type {
  CustomContainerComponentProps,
  CustomItemComponentProps,
  VirtualizerHandle,
  VirtualizerProps,
} from 'virtua'

import type { VirtualizedItem } from '../hooks'

import { forwardRef, useRef } from 'react'
import type { ComponentProps, MutableRefObject, ReactNode, Ref } from 'react'

import { Virtualizer } from 'virtua'

import { useMergedRefs } from '~shared/hooks'

import { isFunction } from '~shared/utils'

import { useVirtualizedItems } from '../hooks'

type VirtualListItemProps = ComponentProps<'div'> & CustomItemComponentProps

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

export type VirtualListProps<ListDataElement> = Omit<VirtualizerProps, 'children'> & {
  data: ListDataElement[]
  children: VirtualListRenderFunction<ListDataElement> | ReactNode | ReactNode[]
  estimateSize?: (index: number) => number
  slotsClassNames?: Partial<Record<VirtualListSlots, string>>
  scrollElementRef?: Ref<HTMLDivElement>
  contentWrapperRef?: Ref<HTMLDivElement>
  virtualListRef?: MutableRefObject<NullablePossible<VirtualizerHandle>>
  count?: number
  width?: number
  height?: number
  gap?: number
}

export const VirtualList = <T = unknown>(props: VirtualListProps<T>) => {
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

  const internalContentWrapperRef = useRef<HTMLDivElement>(null)
  const internalScrollRef = useRef<HTMLDivElement>(null)

  const virtualizedItems = useVirtualizedItems(data)

  const scrollMergedRef = useMergedRefs(scrollElementRef, internalScrollRef)
  const contentWrapperMergedRef = useMergedRefs(contentWrapperRef, internalContentWrapperRef)

  return (
    <div
      ref={contentWrapperMergedRef}
      data-slot="virtual-list-container"
      style={{ position: 'relative' }}
    >
      <div
        ref={scrollMergedRef}
        className={slotsClassNames?.container}
        data-slot="virtual-list-wrapper"
        style={{
          width,
          height,
          overflowY: 'auto',
          contain: 'strict',
        }}
      >
        <Virtualizer
          ref={(ref) => {
            if (virtualListRef?.current === null) {
              virtualListRef.current = ref
            }
          }}
          as={VirtualListContainer}
          item={VirtualListItem}
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
