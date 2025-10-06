import type {
  CustomContainerComponentProps,
  CustomItemComponentProps,
  WindowVirtualizerHandle,
  WindowVirtualizerProps,
} from 'virtua'

import type { VirtualizedItem } from '../hooks'

import { forwardRef } from 'react'
import type { ComponentProps, MutableRefObject, ReactNode } from 'react'

import { WindowVirtualizer } from 'virtua'

import { isFunction } from '~shared/utils'

import { useVirtualizedItems } from '../hooks'

type WindowVirtualListItemProps = ComponentProps<'div'> & CustomItemComponentProps

const WindowVirtualListItem = forwardRef(
  (props: WindowVirtualListItemProps, extRef: any) => {
    return (
      <div
        data-slot="window-virtual-list-item"
        ref={extRef}
        {...props}
      />
    )
  },
)

const WindowVirtualListContainer = forwardRef((props: CustomContainerComponentProps, extRef: any) => {
  return <div data-slot="window-virtual-list" ref={extRef} {...props} />
})

export type WindowVirtualListSlots
  = | 'container'
    | 'item'

export type WindowVirtualListRenderFunction<DataItem>
= (data: DataItem[], virtualizedItem: VirtualizedItem) => ReactNode

export type WindowVirtualListProps<ListDataElement> = Omit<WindowVirtualizerProps, 'children'> & {
  data: ListDataElement[]
  children: WindowVirtualListRenderFunction<ListDataElement> | ReactNode | ReactNode[]
  virtualListRef?: MutableRefObject<NullablePossible<WindowVirtualizerHandle>>
  count?: number
  gap?: number
}

export const WindowVirtualList = <T = unknown>(props: WindowVirtualListProps<T>) => {
  const {
    gap = 4,
    data,
    virtualListRef,
    children,
    ...virtualizerOptions
  } = props

  const virtualizedItems = useVirtualizedItems(data)

  return (
    <WindowVirtualizer
      ref={(ref) => {
        if (virtualListRef?.current === null) {
          virtualListRef.current = ref
        }
      }}
      as={WindowVirtualListContainer}
      item={WindowVirtualListItem}
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
    </WindowVirtualizer>
  )
}
