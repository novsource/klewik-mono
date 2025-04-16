import { useMemo } from 'react'

import { Donation } from '~entities/donation/model'

import { Badge } from '~shared/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '~shared/ui/card'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { formatNumberToIntlString } from '~shared/utils'

import { DonationCardBadge } from './donation-card-badge.ui'
import { DonationCardChip } from './donation-card-chip.ui'
import { DonationCardMessage } from './donation-card-message.ui'

type DonationCardProps = Donation

const DonationCard = (props: DonationCardProps) => {
  const {
    amount,
    message,
    username,
    provider,
    currency,
    message_type,
    processingStatus,
  } = props

  const providerName = {
    'donation-alerts': 'DonationAlerts',
    'donate-pay': 'DonatePay',
  }[provider]

  const cardMessage = useMemo(() => {
    if (!message) return undefined

    if (message && message_type === 'audio') {
      return (
        <Flex
          className="w-fit bg-dark-accent/70 px-2 py-1.5 rounded-md gap-x-1.5"
          align="center"
        >
          <Icons.Sound className="text-gray-light" />
          <Typography
            className="text-gray-light text-sm font-medium font-golos-f"
            tag="span"
          >
            Аудио-формат сообщений не поддерживается
          </Typography>
        </Flex>
      )
    }

    return <DonationCardMessage value={message} />
  }, [message, message_type])

  return (
    <Card>
      <CardHeader className="flex gap-x-2">
        <Badge className={'bg-orange/20 text-orange'}>
          <Flex className="gap-x-1" align={'center'}>
            <Icons.DonationAlerts width={14} height={14} />
            {providerName}
          </Flex>
        </Badge>
        <DonationCardBadge status={processingStatus} />
      </CardHeader>
      <CardContent className="w-full flex flex-col py-2">
        <Flex className="gap-y-2" direction="column">
          <Flex className="gap-x-1.5" direction="row" align="center">
            <Typography tag="span" className="text-title font-bold">
              {username}
            </Typography>
            <Typography tag="span" className="text-md font-semibold">
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
        {cardMessage}
      </CardContent>
      <CardFooter className="flex flex-row gap-x-1 mt-2 items-end justify-between">
        <Flex className="gap-x-2">
          <DonationCardChip
            startContent={<Icons.Coin className="text-gray-accent" size="sm" />}
            classNames={{
              base: 'bg-dark-accent',
              text: 'text-gray-accent font-medium',
            }}
          >
            {formatNumberToIntlString(Math.floor(amount))}
          </DonationCardChip>
        </Flex>
        <Typography className="text-gray" tag="span">
          {new Intl.RelativeTimeFormat().format(-5, 'seconds')}
        </Typography>
      </CardFooter>
    </Card>
  )
}

export { DonationCard }
