import { Donation } from '~entities/donation/model'

import { Card, CardContent, CardFooter, CardHeader } from '~shared/ui/card'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { formatNumberToIntlString } from '~shared/utils'

import { DonationCardBadge } from './donation-card-badge.ui'
import { DonationCardChip } from './donation-card-chip.ui'

type DonationCardProps = Donation

const DonationCard = (props: DonationCardProps) => {
  const { amount, message, username, provider, currency, message_type } = props

  const providerName = {
    'donation-alerts': 'DonationAlerts',
    'donate-pay': 'DonatePay',
  }[provider]

  return (
    <Card>
      <CardHeader className="flex">
        <DonationCardBadge status="error" />
      </CardHeader>
      <CardContent className="w-full flex flex-col py-0.5">
        <Flex className="gap-y-1.5" direction="column">
          <Flex direction="row" align="center">
            <Typography tag="span" className="text-title font-semibold">
              {username}
            </Typography>
            <Typography tag="span" className="text-md font-medium">
              отправил
            </Typography>
            <Typography
              tag="span"
              className="font-semibold text-green text-[17px] font-golos-f"
            >
              {formatNumberToIntlString(amount)}
              {` ${currency.toUpperCase()}`}
            </Typography>
          </Flex>
        </Flex>
        <Typography tag="p">
          {message_type === 'audio'
            ? 'Аудио-формат не поддерживается'
            : message}
        </Typography>
      </CardContent>
      <CardFooter className="flex flex-row gap-x-1 mt-2">
        <DonationCardChip
          startContent={<Icons.DonationAlerts width={14} height={14} />}
          classNames={{ base: 'bg-orange/30', text: 'text-orange font-medium' }}
        >
          {providerName}
        </DonationCardChip>
      </CardFooter>
    </Card>
  )
}

export { DonationCard }
