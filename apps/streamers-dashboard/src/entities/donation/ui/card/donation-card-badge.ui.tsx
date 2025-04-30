import { ComponentProps, memo } from 'react'

import { ProcessedDonation } from '~entities/donation/model'

import { Badge, BadgeProps } from '~shared/ui/badge'
import { Skeleton } from '~shared/ui/skeleton'

import { DONATION_STATUS_NAME } from '~shared/constants/donations'

import { cn } from '~shared/utils'

type DonationCardBadgeProps = BadgeProps & {
  status: ProcessedDonation['processingStatus']
}

const DonationCardBadge = memo((props: DonationCardBadgeProps) => {
  const { status, variant, ...badgeProps } = props

  const donationStatusToBadgeVariants: Record<
    ProcessedDonation['processingStatus'],
    string
  >[ProcessedDonation['processingStatus']] = {
    added: 'success',
    confirm: 'warning',
    empty: 'default',
    error: 'error',
  }[status]

  return (
    <Badge
      className="text-nowrap font-medium"
      variant={donationStatusToBadgeVariants}
      {...badgeProps}
    >
      {DONATION_STATUS_NAME[status]}
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
