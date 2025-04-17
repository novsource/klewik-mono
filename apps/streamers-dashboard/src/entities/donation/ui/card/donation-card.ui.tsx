import { ReactNode, useMemo } from 'react'

import { ProcessedDonation } from '~entities/donation/model'

import { Badge } from '~shared/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardProps,
} from '~shared/ui/card'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { formatNumberToIntlString } from '~shared/utils'

import { DonationCardBadge } from './donation-card-badge.ui'
import { DonationCardChip } from './donation-card-chip.ui'
import { DonationCardMessage } from './donation-card-message.ui'

export type DonationCardProps = CardProps & {
  data: ProcessedDonation
  renderHeader?: (donation: ProcessedDonation) => ReactNode | undefined
  renderContent?: (donation: ProcessedDonation) => ReactNode | undefined
  renderFooter?: (donation: ProcessedDonation) => ReactNode | undefined
}

const DonationCard = (props: DonationCardProps) => {
  const { data, renderHeader, renderContent, renderFooter, ...cardProps } =
    props

  const providerName = {
    'donation-alerts': 'DonationAlerts',
    'donate-pay': 'DonatePay',
  }[data.provider]

  const cardMessage = useMemo(() => {
    if (!data.message) return undefined

    if (data.message && data.message_type === 'audio') {
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

    return <DonationCardMessage value={data.message} />
  }, [data.message, data.message_type])

  const cardHeader = useMemo(() => {
    return renderHeader ? (
      renderHeader(data)
    ) : (
      <>
        <Badge className={'bg-orange/20 text-orange'}>
          <Flex className="gap-x-1" align={'center'}>
            <Icons.DonationAlerts width={14} height={14} />
            {providerName}
          </Flex>
        </Badge>
        <DonationCardBadge status={data.processingStatus} />
      </>
    )
  }, [data.processingStatus, providerName, renderHeader])

  const cardContent = useMemo(() => {
    return renderContent ? (
      renderContent(data)
    ) : (
      <>
        <Flex className="gap-y-2" direction="column">
          <Flex className="gap-x-1.5" direction="row" align="center">
            <Typography tag="span" className="text-title font-bold">
              {data.username}
            </Typography>
            <Typography tag="span" className="text-md font-semibold">
              отправил
            </Typography>
            <Typography
              tag="span"
              className="font-semibold text-green text-[17px] font-golos-f"
            >
              {formatNumberToIntlString(data.amount)}
              {` ${data.currency.toUpperCase()}`}
            </Typography>
          </Flex>
        </Flex>
        {cardMessage}
      </>
    )
  }, [renderContent, data.amount, data.currency, data.username, cardMessage])

  const cardFooter = useMemo(() => {
    return renderFooter ? (
      renderFooter(data)
    ) : (
      <>
        <Flex className="gap-x-2">
          <DonationCardChip
            startContent={<Icons.Coin className="text-gray-accent" size="sm" />}
            classNames={{
              base: 'bg-dark-accent',
              text: 'text-gray-accent font-medium',
            }}
          >
            {formatNumberToIntlString(Math.floor(data.amount))}
          </DonationCardChip>
        </Flex>
        <Typography className="text-gray" tag="span">
          {new Intl.RelativeTimeFormat().format(
            data.createdAt ?? -5,
            'seconds'
          )}
        </Typography>
      </>
    )
  }, [renderFooter, data.amount, data.createdAt])

  return (
    <Card {...cardProps}>
      <CardHeader className="flex gap-x-2">{cardHeader}</CardHeader>
      <CardContent className="w-full flex flex-col py-2">
        {cardContent}
      </CardContent>
      <CardFooter className="flex flex-row gap-x-1 mt-2 items-end justify-between">
        {cardFooter}
      </CardFooter>
    </Card>
  )
}

export { DonationCard }
