import { ReactNode, memo, useMemo } from 'react'

import { ClassValue } from 'class-variance-authority/types'
import { motion } from 'framer-motion'

import { Donation } from '~entities/donation/model'
import { donationsSelectors } from '~entities/donation/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Badge, BadgeProps } from '~shared/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '~shared/ui/card'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

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

type DonationCardChipProps = {
  children: ReactNode
  startContent?: JSX.Element
  endContent?: JSX.Element
  classNames?: {
    base?: ClassValue
    text?: ClassValue
  }
}

const DonationCardChip = (props: DonationCardChipProps) => {
  const { children, startContent, endContent, classNames } = props

  return (
    <Flex
      className={cn(
        'px-1.5 py-1 bg-gray/30 gap-x-0.5 rounded-md',
        classNames?.base
      )}
      direction="row"
      align="center"
    >
      {startContent}
      <Typography
        className={cn(
          'font-golos-f text-sm font-semibold text-gray-accent',
          classNames?.text
        )}
        tag="span"
      >
        {children}
      </Typography>
      {endContent}
    </Flex>
  )
}

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
              {new Intl.NumberFormat('ru-RU', {
                currency,
                currencyDisplay: 'name',
              }).format(amount)}
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

type DonationListProps = {
  data?: Donation[]
  className?: ClassValue
}

const DonationsList = memo((props: DonationListProps) => {
  const { data, className } = props

  const storeDonations = useStoreSelector(donationsSelectors.getAllDonations)

  const donations = useMemo(
    () => data ?? storeDonations,
    [data, storeDonations]
  )

  return (
    <Flex
      className={cn('gap-y-2', className)}
      component="ul"
      direction="column"
    >
      {donations.map((donation) => (
        <motion.li
          key={donation.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <DonationCard {...donation} />
        </motion.li>
      ))}
    </Flex>
  )
})

export { DonationsList }
