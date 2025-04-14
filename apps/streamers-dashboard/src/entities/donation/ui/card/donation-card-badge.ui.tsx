import { Badge, BadgeProps } from '~shared/ui/badge'

type DonationCardBadgeProps = BadgeProps & {
  status: 'success' | 'error' | 'warning' | 'default'
}

const DonationCardBadge = (props: DonationCardBadgeProps) => {
  const { status, variant, ...badgeProps } = props
  const badgeText = {
    success: 'Успешно',
    error: 'Ошибка',
    warning: 'Требуется подтверждение',
    default: 'Нет данных',
  }[status]

  return (
    <Badge variant={variant ?? status} {...badgeProps}>
      {badgeText}
    </Badge>
  )
}

export { DonationCardBadge }
