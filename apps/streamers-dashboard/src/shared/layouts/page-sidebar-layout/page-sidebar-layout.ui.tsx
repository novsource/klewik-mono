import type { ComponentPropsWithRef } from 'react'
import { forwardRef } from 'react'

import { cn } from '~shared/utils/react'

export type PageSidebarLayoutProps = ComponentPropsWithRef<'aside'>

export const PageSidebarLayout = forwardRef<HTMLElement, PageSidebarLayoutProps>((props, forwardRef) => {
  const { className, ...restProps } = props

  return (
    <aside
      ref={forwardRef}
      className={cn('h-screen py-4 border-r-1 border-r-dark bg-dark-foreground-light', className)}
      {...restProps}
    />

  )
})
