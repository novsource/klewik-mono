import type {
  CustomContainerComponentProps,
  CustomItemComponentProps,
  VirtualizerHandle,
  VirtualizerProps,
} from 'virtua'

import { forwardRef, useLayoutEffect, useRef } from 'react'
import type { ComponentProps, MutableRefObject, ReactNode } from 'react'

import { Virtualizer } from 'virtua'

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

export type VirtualListProps<ListDataElement = unknown> = VirtualizerProps & {
  data: ListDataElement[]
  children: (
    data: ListDataElement[],
    index: number,
    virtualList: NullablePossible<VirtualizerHandle>
  ) => ReactNode
  estimateSize?: (index: number) => number
  slotsClassNames?: Partial<Record<VirtualListSlots, string>>
  scrollElementRef?: MutableRefObject<NullablePossible<HTMLDivElement>>
  contentWrapperRef?: MutableRefObject<NullablePossible<HTMLDivElement>>
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
    scrollElementRef,
    contentWrapperRef,
    slotsClassNames,
    children,
    ...virtualizerOptions
  } = props
  const internalScrollElementRef = useRef<HTMLDivElement>(null)
  const virtualListRef = useRef<NullablePossible<VirtualizerHandle>>(null)

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
          ref={ref => virtualListRef.current = ref}
          as={VirtualListContainer}
          item={VirtualListItem}
          scrollRef={internalScrollElementRef}
          {...virtualizerOptions}
        >
          {data.map((_, index) => {
            return (
              <div
                key={index}
                style={{ marginTop: index === 0 ? 0 : gap }}
              >
                {children(data, index, virtualListRef.current)}
              </div>
            )
          })}
        </Virtualizer>
      </div>

    </div>
  )
}

export { VirtualList }
