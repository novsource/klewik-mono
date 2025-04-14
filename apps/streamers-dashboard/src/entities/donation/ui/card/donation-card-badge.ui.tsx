import { memo } from 'react'

import { Donation } from '~entities/donation/model'

import { Badge, BadgeProps } from '~shared/ui/badge'

type DonationCardBadgeProps = BadgeProps & {
  status: Donation['processingStatus']
}

const DonationCardBadge = memo((props: DonationCardBadgeProps) => {
  const { status, variant, ...badgeProps } = props

  const badgeText: Record<
    Donation['processingStatus'],
    string
  >[Donation['processingStatus']] = {
    added: 'Добавлен в аукцион',
    confirm: 'Требуется подтверждение',
    empty: 'Данные не найдены',
    error: 'Ошибка обработки',
  }[status]

  const donationStatusToBadgeVariants: Record<
    Donation['processingStatus'],
    string
  >[Donation['processingStatus']] = {
    added: 'success',
    confirm: 'warning',
    empty: 'default',
    error: 'error',
  }[status]

  return (
    <Badge variant={donationStatusToBadgeVariants} {...badgeProps}>
      {badgeText}
    </Badge>
  )
})

export { DonationCardBadge }
