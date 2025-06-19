import { ComponentProps, memo } from 'react'

import { DONATION_PROCESSED_STATUS } from '~entities/donation/constants'
import {
  ProcessedDonation,
  ProcessedDonationStatus,
} from '~entities/donation/model'

import { Badge, BadgeProps } from '~shared/ui/badge'
import { Skeleton } from '~shared/ui/skeleton'

import { cn } from '~shared/utils'

type DonationCardBadgeProps = BadgeProps & {
  status: ProcessedDonation['processedStatus']
}

const DonationCardBadge = memo((props: DonationCardBadgeProps) => {
  const { status, variant, ...badgeProps } = props

  const donationStatusToBadgeVariants: Record<
    ProcessedDonationStatus,
    NonNullable<BadgeProps['variant']>
  >[ProcessedDonationStatus] = {
    added: 'success',
    inProgress: 'warning',
    checkRequested: 'warning',
    empty: 'default',
    error: 'error',
    rejected: 'error',
  }[status]

  return (
    <Badge
      className="text-nowrap font-medium"
      variant={donationStatusToBadgeVariants}
      {...badgeProps}
    >
      {DONATION_PROCESSED_STATUS[status]}
    </Badge>
  )
})

const SkeletonDonationCardBadge = ({
  className,
  ...props
}: ComponentProps<'div'>) => {
  return (
    <Skeleton className={cn('rounded-pill h-6 w-32', className)} {...props} />
  )
}

export { DonationCardBadge, SkeletonDonationCardBadge }
