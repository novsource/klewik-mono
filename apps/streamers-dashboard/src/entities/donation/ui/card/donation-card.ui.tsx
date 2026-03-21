import type { BadgeProps } from 'klewik-ui/badge'
import type {
  CardProps,
} from 'klewik-ui/card'
import type { FlexProps } from 'klewik-ui/flex'

import type {
  DonationCardBadgeProps,
} from './donation-card-badge.ui'

import type { ComponentProps } from 'react'
import { useMemo } from 'react'

import { Badge } from 'klewik-ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from 'klewik-ui/card'
import { Divider } from 'klewik-ui/divider'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import { Skeleton } from 'klewik-ui/skeleton'

import { DONATION_PROCESSED_STATUS } from '~entities/donation/constants'
import type { ProcessedDonation, ProcessedDonationStatus } from '~entities/donation/model'

import { FORMATTED_INTEGRATIONS_PLATFORMS_NAMES } from '~shared/constants/integrations'
import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { Text } from '~shared/components/typography'

import { useMediaQuery } from '~shared/hooks'

import { cn, formatNumberToIntlString } from '~shared/utils'

import {
  DonationCardBadge,
} from './donation-card-badge.ui'
import {
  DonationCardChip,
} from './donation-card-chip.ui'
import { DonationCardMessage } from './donation-card-message.ui'

export type BaseDonationCardProps = CardProps

export const BaseDonationCard = (props: BaseDonationCardProps) => {
  const { className, ...restProps } = props

  return <Card className={cn('border-1 border-dark-light max-tablet:py-0 max-tablet:pt-1 max-tablet:pb-2.5', className)} {...restProps} />
}

export type BaseDonationCardHeaderProps = ComponentProps<'div'>

export const BaseDonationCardHeader = (props: BaseDonationCardHeaderProps) => {
  const { className, ...restProps } = props

  return <CardHeader className={cn('flex gap-x-2', className)} {...restProps} />
}

export type BaseDonationCardContentProps = ComponentProps<'div'>

export const BaseDonationCardContent = (props: BaseDonationCardContentProps) => {
  const { className, ...restProps } = props

  return <CardContent className={cn('w-full flex flex-col p-0 pt-0.75 tablet:pt-2', className)} {...restProps} />
}

export type BaseDonationCardFooterProps = ComponentProps<'div'>

export const BaseDonationCardFooter = (props: BaseDonationCardFooterProps) => {
  const { className, ...restProps } = props

  return (
    <CardFooter
      className={cn('flex flex-row gap-x-1 mt-2 items-end justify-between', className)}
      {...restProps}
    />
  )
}

const donationStatusToBadgeVariants: Record<ProcessedDonationStatus, BadgeProps['variant']> = {
  added: 'success',
  inProgress: 'warning',
  checkRequested: 'warning',
  empty: 'default',
  error: 'error',
  rejected: 'error',
} as const

export type DonationCardStatusBadgeProps = DonationCardBadgeProps & {
  status: ProcessedDonationStatus
}

export const DonationCardStatusBadge = (props: DonationCardStatusBadgeProps) => {
  const { status, ...badgeProps } = props

  return (
    <DonationCardBadge
      variant={donationStatusToBadgeVariants[status]}
      {...badgeProps}
    >
      {DONATION_PROCESSED_STATUS[status]}
    </DonationCardBadge>
  )
}

export type SolidDonationCardHeaderProps = BaseDonationCardHeaderProps & {
  donationData: Pick<ProcessedDonation, 'processData' | 'source'>
}

export const SolidDonationCardHeader = (props: SolidDonationCardHeaderProps) => {
  const { donationData, ...restProps } = props

  return (
    <BaseDonationCardHeader {...restProps}>
      <>
        <DonationCardBadge />
        <Badge className="bg-orange/10 text-orange">
          <Flex className="gap-x-1" align="center">
            <Icons.DonationAlerts width={14} height={14} />
            {FORMATTED_INTEGRATIONS_PLATFORMS_NAMES[donationData.source]}
          </Flex>
        </Badge>
        <DonationCardStatusBadge status={donationData.processData.status} />
      </>
    </BaseDonationCardHeader>
  )
}

export type DonationCardUsernameInfoProps = FlexProps & {
  donationData: Pick<ProcessedDonation, 'username' | 'amount' | 'currency'>
}

export const DonationCardUsernameInfo = (props: DonationCardUsernameInfoProps) => {
  const { className, donationData, ...restProps } = props

  return (
    <Flex
      className={cn('gap-x-1.5', className)}
      align="center"
      {...restProps}
    >
      <Text className="text-md tablet:text-title font-bold text-white-accent" asSpan>
        {donationData.username}
      </Text>
      <Text className="text-md font-semibold" asSpan>
        отправил
      </Text>
      <Text
        className="font-semibold text-green text-md tablet:text-title font-golos-f"
        asSpan
      >
        {`${formatNumberToIntlString(donationData.amount)} ${donationData.currency.toUpperCase()}`}
      </Text>
    </Flex>
  )
}

export type SolidDonationCardContentProps
  = BaseDonationCardContentProps
  & {
    donationData: Pick<ProcessedDonation, 'processData' | 'message' | 'messageType'>
    usernameInfoProps?: Omit<DonationCardUsernameInfoProps, 'donationData'>
  } & Pick<DonationCardUsernameInfoProps, 'donationData'>

export const SolidDonationCardContent = (props: SolidDonationCardContentProps) => {
  const {
    usernameInfoProps,
    donationData,
    ...restProps
  } = props

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  const cardMessage = useMemo(() => {
    const isEmptyMessage
      = !donationData.message && donationData.messageType !== 'audio'

    if (isEmptyMessage)
      return

    const isTextMessage = donationData.messageType === 'text'
    const isAudioMessage = donationData.messageType === 'audio'

    if (isTextMessage) {
      return <DonationCardMessage value={donationData.message!} />
    }

    if (isAudioMessage) {
      return (
        <Flex
          className="w-fit bg-dark-accent/70 px-1 py-1 gap-x-1 rounded-md tablet:gap-x-1.5 whitespace-nowrap tablet:px-2 tablet:py-1.5"
          align="center"
        >
          <Icons.Sound className="text-gray-light" size={isLargeThenTablet ? 'default' : 'sm'} />
          <Text
            className="text-gray-light text-xs font-medium font-golos-f text-wrap tablet:text-sm"
            asSpan
          >
            Аудио-сообщения не поддерживаются
          </Text>
        </Flex>
      )
    }
  }, [donationData.message, donationData.messageType, isLargeThenTablet])

  return (
    <BaseDonationCardContent {...restProps}>
      <Flex className="gap-y-2" direction="column">
        <DonationCardUsernameInfo
          donationData={donationData}
          {...usernameInfoProps}
        />
      </Flex>
      {cardMessage}
    </BaseDonationCardContent>
  )
}

export type SolidDonationCardFooterProps = ComponentProps<'div'> & {
  donationData: Pick<ProcessedDonation, 'processData' | 'amount'>
}

export const SolidDonationCardFooter = (props: SolidDonationCardFooterProps) => {
  const { donationData, ...restProps } = props

  return (
    <BaseDonationCardFooter {...restProps}>
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
                <Text
                  className="font-golos-f text-gray-accent"
                  asSpan
                >
                  {formatNumberToIntlString(
                    Math.floor(
                      (donationData.processData.slotsIds && donationData.processData.slotsIds[0]) || 0,
                    ),
                  )}
                </Text>
              </Flex>

              <Divider className="border-1 h-3/4 border-gray mx-1.5" />

              <Flex className="gap-x-1" align="center" justify="center">
                <Icons.Coin className="text-gray-accent" size="sm" />
                <Text
                  className="font-golos-f text-gray-accent"
                  asSpan
                >
                  {formatNumberToIntlString(Math.floor(donationData.amount))}
                </Text>
              </Flex>
            </>
          </DonationCardChip>
        </Flex>
        <Text className="text-gray" asSpan>
          {new Intl.RelativeTimeFormat().format(-5, 'seconds')}
        </Text>
      </>
    </BaseDonationCardFooter>
  )
}

export type SolidDonationCardProps = BaseDonationCardProps & {
  donation: ProcessedDonation
  headerProps?: Omit<SolidDonationCardHeaderProps, 'donationData'>
  contentProps?: Omit<SolidDonationCardContentProps, 'donationData'>
  footerProps?: Omit<SolidDonationCardFooterProps, 'donationData'>
}

export const SolidDonationCard = (props: SolidDonationCardProps) => {
  const {
    donation,
    headerProps,
    contentProps,
    footerProps,
    ...restProps
  } = props

  return (
    <BaseDonationCard {...restProps}>
      <SolidDonationCardHeader donationData={donation} {...headerProps} />
      <SolidDonationCardContent donationData={donation} {...contentProps} />
      <SolidDonationCardFooter donationData={donation} {...footerProps} />
    </BaseDonationCard>
  )
}

export type SkeletonDonationCardProps = BaseDonationCardProps

export const SkeletonDonationCard = (props: SkeletonDonationCardProps) => {
  return (
    <BaseDonationCard {...props}>
      <BaseDonationCardHeader className="h-6.25">
        <Flex className="gap-x-1" align="center">
          <Skeleton className="w-28 h-full rounded-pill" />
          <Skeleton className="w-20 h-full rounded-pill" />
        </Flex>
      </BaseDonationCardHeader>
      <BaseDonationCardContent className="gap-y-1 tablet:pt-3">
        <Flex className="h-6.25 gap-x-2">
          <Skeleton className="w-32 h-full" />
          <Skeleton className="w-18 h-full" />
          <Skeleton className="w-24 h-full" />
        </Flex>
        <Skeleton className="min-w-20 w-full max-w-[300px] h-7" />
      </BaseDonationCardContent>
    </BaseDonationCard>
  )
}
