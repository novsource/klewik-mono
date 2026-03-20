import type { ComponentProps } from 'react'

import type { BadgeProps } from '~shared/ui/badge'
import { Badge } from '~shared/ui/badge'
import { Skeleton } from '~shared/ui/skeleton'

import { cn } from '~shared/utils'

export type DonationCardBadgeProps = BadgeProps

export const DonationCardBadge = (props: DonationCardBadgeProps) => {
  return (
    <Badge
      className="text-nowrap font-medium text-[11px] leading-4 max-tablet:text-[10px] max-tablet:h-5 transition-none"
      {...props}
    />
  )
}

export const SkeletonDonationCardBadge = ({
  className,
  ...props
}: ComponentProps<'div'>) => {
  return (
    <Skeleton className={cn('rounded-pill h-6 w-32', className)} {...props} />
  )
}
