import type { ComponentPropsWithoutRef } from 'react'
import { forwardRef } from 'react'

import { cn } from '~shared/utils/react'

export type PageDashboardLayoutProps = ComponentPropsWithoutRef<'div'>

export const PageDashboardLayout = forwardRef<HTMLDivElement, PageDashboardLayoutProps>((props, forwardRef) => {
  const { className, ...restProps } = props

  return (
    <div
      ref={forwardRef}
      className={cn([
        'mx-auto mb-4 h-full w-full gap-y-3 pt-3 pb-26 tablet:pt-10 tablet:min-h-[var(--height-page)] tablet:h-auto',
        'mobile:gap-y-5',
        'max-tablet:max-w-[1100px] tablet:gap-y-0 tablet:pb-0 tablet:pl-4',
        'desktop:max-w-[1750px] desktop-lg:max-w-[2100px]',
        'landtop:max-w-[1600px]',
        className,
      ])}
      {...restProps}
    />
  )
})
