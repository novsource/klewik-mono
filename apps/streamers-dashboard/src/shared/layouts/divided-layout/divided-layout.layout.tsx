import type { ComponentPropsWithoutRef, ComponentPropsWithRef } from 'react'

import { Divider } from 'klewik-ui/divider'

import { cn } from '~shared/utils/react'

export type DividedLayoutProps = {
  orientation?: 'horizontal' | 'vertical'
  gap?: number
} & ExtractComponentClassnameToSlot<ComponentPropsWithRef<'hr'>, 'divider', 'dividerProps'>
  & ExtractComponentClassnameToSlot<ComponentPropsWithoutRef<'div'>, 'container'>

export const DividedLayout = (props: DividedLayoutProps) => {
  const { children, slotClassnames, orientation = 'vertical', gap = 2, dividerProps, ...restProps } = props

  return (
    <div className={cn(slotClassnames?.container)} {...restProps}>
      {Array.isArray(children) && children.reduce((acc, node, index) => {
        if (index !== 0) {
          acc.push(
            <Divider
              className={slotClassnames?.divider}
              orientation={orientation}
              {...dividerProps}
              style={{ margin: orientation === 'vertical' ? `0 ${gap}px` : `${gap}px 0` }}
            />,
          )
        }

        acc.push(node)

        return acc
      }, [])}

      {!Array.isArray(children) && children}
    </div>
  )
}
