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
import { Divider } from '~shared/ui/divider'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Skeleton } from '~shared/ui/skeleton'
import { Typography } from '~shared/ui/typograghy'

import { FORMATTED_INTEGRATIONS_PLATFORMS_NAMES } from '~shared/constants/integrations'

import { cn, formatNumberToIntlString } from '~shared/utils'

import {
  DonationCardBadge,
  SkeletonDonationCardBadge,
} from './donation-card-badge.ui'
import {
  DonationCardChip,
  SkeletonDonationCardChip,
} from './donation-card-chip.ui'
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

  const isShouldSkipFooterRendering = data.processedStatus !== 'added'

  const cardMessage = useMemo(() => {
    if (!data.message) return undefined

    if (data.message && data.messageType === 'audio') {
      return (
        <Flex
          className="w-fit bg-dark-accent/70 px-2 py-1.5 rounded-md gap-x-1.5 whitespace-nowrap"
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
  }, [data.message, data.messageType])

  const cardHeader = useMemo(() => {
    if (renderHeader) {
      return renderHeader(data)
    }

    return (
      <>
        <Badge className={'bg-orange/20 text-orange'}>
          <Flex className="gap-x-1" align={'center'}>
            <Icons.DonationAlerts width={14} height={14} />
            {FORMATTED_INTEGRATIONS_PLATFORMS_NAMES[data.source]}
          </Flex>
        </Badge>
        <DonationCardBadge status={data.processedStatus} />
      </>
    )
  }, [data.processedStatus, data.source, data.processedStatus, renderHeader])

  const cardContent = useMemo(() => {
    if (renderContent) return renderContent(data)

    return (
      <>
        <Flex className="gap-y-2" direction="column">
          <Flex className="gap-x-1.5" align="center">
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
        {!isShouldSkipFooterRendering ? (
          cardMessage
        ) : (
          <Flex align="end">
            {cardMessage}
            <Flex className="w-full justify-end text-gray">
              <Typography tag="span">
                {new Intl.RelativeTimeFormat().format(-5, 'seconds')}
              </Typography>
            </Flex>
          </Flex>
        )}
      </>
    )
  }, [
    isShouldSkipFooterRendering,
    renderContent,
    data.amount,
    data.currency,
    data.username,
    cardMessage,
  ])

  const cardFooter = useMemo(() => {
    if (isShouldSkipFooterRendering) return
    if (renderFooter) return renderFooter(data)

    return (
      <>
        <Flex className="gap-x-2">
          <DonationCardChip
            classNames={{
              base: 'bg-dark-accent items-center',
              text: 'text-gray-accent font-medium',
            }}
          >
            <>
              <Flex className="gap-x-1" align="center" justify="center">
                <Icons.Id className="text-gray-accent" size="sm" />
                <Typography
                  tag="span"
                  className="font-golos-f text-gray-accent"
                >
                  {formatNumberToIntlString(
                    Math.floor(
                      (data.processedSlotsIds && data.processedSlotsIds[0]) || 0
                    )
                  )}
                </Typography>
              </Flex>
              <Divider className="border-1 h-3/4 border-gray mx-1.5" />
              <Flex className="gap-x-1" align="center" justify="center">
                <Icons.Coin className="text-gray-accent" size="sm" />
                <Typography
                  tag="span"
                  className="font-golos-f text-gray-accent"
                >
                  {formatNumberToIntlString(Math.floor(data.amount))}
                </Typography>
              </Flex>
            </>
          </DonationCardChip>
        </Flex>
        <Typography className="text-gray" tag="span">
          {new Intl.RelativeTimeFormat().format(-5, 'seconds')}
        </Typography>
      </>
    )
  }, [isShouldSkipFooterRendering, renderFooter, data.amount, data.createdAt])

  return (
    <Card {...cardProps}>
      <CardHeader className="flex gap-x-2">{cardHeader}</CardHeader>
      <CardContent
        className={cn(
          'w-full flex flex-col p-0',
          isShouldSkipFooterRendering ? 'pt-2' : 'py-2'
        )}
      >
        {cardContent}
      </CardContent>
      <CardFooter className="flex flex-row gap-x-1 mt-2 items-end justify-between">
        {cardFooter}
      </CardFooter>
    </Card>
  )
}

type SkeletonDonationCardProps = CardProps

const SkeletonDonationCard = (props: SkeletonDonationCardProps) => {
  return (
    <Card {...props}>
      <CardHeader className="flex gap-x-2">
        <SkeletonDonationCardBadge />
        <SkeletonDonationCardBadge />
      </CardHeader>
      <CardContent className={'w-full flex flex-col p-0 py-2'}>
        <Skeleton className="max-w-[280px] h-6 rounded-md" />
      </CardContent>
      <CardFooter className="flex flex-row gap-x-1 mt-2 items-end justify-between">
        <Flex className="gap-x-2">
          <SkeletonDonationCardChip />
          <SkeletonDonationCardChip />
        </Flex>
        <SkeletonDonationCardChip className="h-5" />
      </CardFooter>
    </Card>
  )
}

export { DonationCard, SkeletonDonationCard }
