import type { Donation } from '~entities/donation/model'
import { DonationCardMessage } from '~entities/donation/ui/card'

import type { IntegrationsPlatforms } from '~entities/integrations/model'

import { Button } from 'klewik-ui/button'
import { Card } from 'klewik-ui/card'
import { Icons } from 'klewik-ui/icons'
import { Text } from 'klewik-ui/typography'

import { formatNumberToIntlString } from '~shared/utils'
import { cn } from '~shared/utils/react'

export type LocalDonationsListCardProps = {
  donation: Donation
}

export const LocalDonationsListCard = (props: LocalDonationsListCardProps) => {
  const { donation } = props

  return (
    <Card className="relative">
      <div className="absolute -top-3 left-3 h-6">
        <div className="flex gap-x-2 items-center">
          <DonationPlatformBadge platform={donation.source} />
          <DonationMoneyBadge amount={donation.amount} currency={donation.currency} />
        </div>

      </div>

      <Button className="absolute -top-3 right-3" isIconOnly icon={<Icons.LargeCross />} size="xs" />

      <div className="my-1.5">
        <Text className="text-base font-semibold" asSpan>{donation.username}</Text>
      </div>

      {donation.message && <DonationCardMessage value={donation.message} />}
      {!donation.message && <div>test</div>}

    </Card>
  )
}

type DonationMoneyBadgeProps = {
  amount: number
  currency: string
}

function DonationMoneyBadge(props: DonationMoneyBadgeProps) {
  const { amount, currency } = props

  return (
    <div className="w-fit h-full rounded-medium bg-green-light text-green-accent px-2 py-1 text-sm font-medium">
      {`${formatNumberToIntlString(amount)} ${currency}`}
    </div>
  )
}

type DonationPlatformBadgeProps = {
  platform: IntegrationsPlatforms
}

function DonationPlatformBadge(props: DonationPlatformBadgeProps) {
  const { platform } = props

  return (
    <div className={cn(
      'w-fit rounded-medium h-full px-2 py-1 font-medium',
      platform === 'donationAlerts' && 'bg-orange text-white',
    )}
    >
      {platform === 'donationAlerts' && <Icons.DonationAlerts className=" [&_path]:fill-white" size="xs" />}
    </div>
  )
}
