import type {
  DonationCardBadgeProps,
} from './donation-card-badge.ui'

import type { ComponentProps } from 'react'
import { useMemo } from 'react'

import { DONATION_PROCESSED_STATUS } from '~entities/donation/constants'
import type { ProcessedDonation, ProcessedDonationStatus } from '~entities/donation/model'

import { FORMATTED_INTEGRATIONS_PLATFORMS_NAMES } from '~shared/constants/integrations'
import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import type { BadgeProps } from '~shared/ui/badge'
import { Badge } from '~shared/ui/badge'
import type {
  CardProps,
} from '~shared/ui/card'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '~shared/ui/card'
import { Divider } from '~shared/ui/divider'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Skeleton } from '~shared/ui/skeleton'
import { Typography } from '~shared/ui/typograghy'

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

export type DonationCardStatusBadgeProps = DonationCardBadgeProps & {
  status: ProcessedDonationStatus
}

export const DonationCardStatusBadge = (props: DonationCardStatusBadgeProps) => {
  const { status, ...badgeProps } = props

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
    <DonationCardBadge
      variant={donationStatusToBadgeVariants}
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
        <DonationCardBadge>

        </DonationCardBadge>
        <Badge className="bg-orange/20 text-orange">
          <Flex className="gap-x-1" align="center">
            <Icons.DonationAlerts width={14} height={14} />
            {FORMATTED_INTEGRATIONS_PLATFORMS_NAMES[donationData.source]}
          </Flex>
        </Badge>
        <DonationCardBadge status={donationData.processData.status} />
      </>
    </BaseDonationCardHeader>
  )
}

export type DonationCardUsernameInfoProps = ComponentProps<'div'> & {
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
      <Typography tag="span" className="text-md tablet:text-title font-bold text-white-accent">
        {donationData.username}
      </Typography>
      <Typography tag="span" className="text-md font-semibold">
        отправил
      </Typography>
      <Typography
        className="font-semibold text-green text-md tablet:text-title font-golos-f"
        tag="span"
      >
        {`${formatNumberToIntlString(donationData.amount)} ${donationData.currency.toUpperCase()}`}
      </Typography>
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

    if (donationData.messageType === 'text') {
      return <DonationCardMessage value={donationData.message!} />
    }

    if (donationData.messageType === 'audio') {
      return (
        <Flex
          className="w-fit bg-dark-accent/70 px-1 py-1 gap-x-1 rounded-md tablet:gap-x-1.5 whitespace-nowrap tablet:px-2 tablet:py-1.5"
          align="center"
        >
          <Icons.Sound className="text-gray-light" size={isLargeThenTablet ? 'default' : 'sm'} />
          <Typography
            className="text-gray-light text-xs font-medium font-golos-f text-wrap tablet:text-sm"
            tag="span"
          >
            Аудио-сообщения не поддерживаются
          </Typography>
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
                <Typography
                  tag="span"
                  className="font-golos-f text-gray-accent"
                >
                  {formatNumberToIntlString(
                    Math.floor(
                      (donationData.processData.slotsIds && donationData.processData.slotsIds[0]) || 0,
                    ),
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
                  {formatNumberToIntlString(Math.floor(donationData.amount))}
                </Typography>
              </Flex>
            </>
          </DonationCardChip>
        </Flex>
        <Typography className="text-gray" tag="span">
          {new Intl.RelativeTimeFormat().format(-5, 'seconds')}
        </Typography>
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
