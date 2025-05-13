import { useRef } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

import {
  ShadowScrollArea,
  ShadowScrollAreaProps,
} from '~shared/ui/shadow-scroll-area'
import { VirtualList, VirtualListProps } from '~shared/ui/virtual-list'

export type ShadowVirtualListProps = VirtualListProps & {
  className: string
  shadowScrollProps?: ShadowScrollAreaProps
}

const ShadowVirtualList = (props: ShadowVirtualListProps) => {
  const { className, shadowScrollProps, ...virtualListProps } = props

  const internalScrollElementRef = useRef<HTMLDivElement>(null)
  const internalContentElementRef = useRef<HTMLDivElement>(null)

  return (
    <AutoSizer className={className}>
      {({ width, height }) => {
        return (
          <ShadowScrollArea
            externalScrollRef={internalScrollElementRef}
            externalContentRef={internalContentElementRef}
            style={{ width, height }}
            {...shadowScrollProps}
          >
            <VirtualList
              width={width}
              height={height}
              scrollElementRef={internalScrollElementRef}
              contentElementRef={internalContentElementRef}
              {...virtualListProps}
            />
          </ShadowScrollArea>
        )
      }}
    </AutoSizer>
  )
}

export { ShadowVirtualList }
