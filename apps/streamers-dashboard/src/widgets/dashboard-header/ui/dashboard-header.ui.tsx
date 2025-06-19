import { ReactNode, memo, useMemo } from 'react'
import { ComponentProps } from 'react'
import { NavLink } from 'react-router-dom'

import NumberFlow from '@number-flow/react'
import * as m from 'motion/react-m'

import { TimerButton } from '~features/auction/set-timer/ui'
import { UpdateBetsStatusButton } from '~features/auction/update-bets-status/ui'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { IntegrationsPlatforms } from '~entities/integrations/model'
import { integrationsSelectors } from '~entities/integrations/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '~shared/ui/tooltip'
import { Typography } from '~shared/ui/typograghy'

import { tailwindScreens } from '~shared/constants/tailwindcss'

import { cn } from '~shared/utils'

import { DonationsStats } from './donations-stats'

export const DashboardHeader = memo(({ children }: { children: ReactNode }) => {
  const isLargeThenTablet = useMediaQuery(
    `(min-width:${tailwindScreens.tablet})`
  )

  return (
    <Header>
      {isLargeThenTablet && (
        <Flex className="h-full gap-x-4" align="center">
          <Flex className="h-8.5 gap-x-4" align="center">
            <Flex className="gap-x-1.5" align="center" justify="center">
              <SlotsStatisticCard />
              <SlotsPointsSumStatisticCard />
              <DonationsStats />
              <IntegrationsStatisticCard />
            </Flex>
            <div className="h-2/3 w-0.5 bg-dark-accent/80" />
            <Flex className="gap-x-1.5" align="center">
              <TimerButton />
              <UpdateBetsStatusButton />
            </Flex>
          </Flex>
        </Flex>
      )}
      {children}
    </Header>
  )
})

const Header = ({ children, ...otherProps }: ComponentProps<'header'>) => {
  return (
    <header className="h-16 w-full" {...otherProps}>
      <Flex
        className="h-full w-full gap-x-4 px-4"
        align="center"
        justify="between"
      >
        <m.div
          whileHover={{ rotate: '180deg' }}
          transition={{ duration: 0.65 }}
        >
          <NavLink to={'/'}>
            <Icons.Logo className="text-green-accent" width={28} height={28} />
          </NavLink>
        </m.div>

        {children}
      </Flex>
    </header>
  )
}

const StatisticCard = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => {
  return (
    <Flex
      className={cn(
        'h-9 gap-x-1.5 rounded-md bg-dark px-2.5 py-1.5 text-md leading-5 font-semibold text-gray-accent',
        className
      )}
      align="center"
      justify="center"
    >
      {children}
    </Flex>
  )
}

const SlotsStatisticCard = memo(() => {
  const slots = useStoreSelector(auctionSlotsSelectors.getSlots)

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger>
        <StatisticCard>
          <Icons.Slots size="sm" />
          <NumberFlow
            className="font-azeret-mono font-medium tracking-tight"
            willChange
            value={slots.length}
          />
        </StatisticCard>
      </TooltipTrigger>
      <TooltipContent>
        <Typography tag="span" className="text-gray-accent">
          Количество слотов, участвующих в аукционе
        </Typography>
      </TooltipContent>
    </Tooltip>
  )
})

const SlotsPointsSumStatisticCard = memo(() => {
  const sum = useStoreSelector(auctionSlotsSelectors.getSlotsPointsSum)

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger>
        <StatisticCard>
          <Icons.PointsSum size="default" />
          <NumberFlow
            className="font-azeret-mono font-medium tracking-tight"
            willChange
            value={sum}
            locales="ru-RU"
          />
        </StatisticCard>
      </TooltipTrigger>
      <TooltipContent>
        <Typography tag="span" className="text-gray-accent">
          Общее количество очков всех слотов
        </Typography>
      </TooltipContent>
    </Tooltip>
  )
})

const IntegrationsStatisticCard = memo(() => {
  const integrations = useStoreSelector(
    integrationsSelectors.getAllIntegrationsStatuses
  )

  const isEmptyIntegrations = useMemo(() => {
    return (Object.keys(integrations) as Array<IntegrationsPlatforms>).every(
      (key) => !integrations[key].isConnected
    )
  }, [integrations])

  const integrationsLogo: Record<IntegrationsPlatforms, ReactNode> = {
    'donation-alerts': <Icons.DonationAlerts width={12} height={18} />,
    'donate-pay': <Icons.DonatePay />,
  }

  const connectedIntegrationsLogos = useMemo(() => {
    return (
      <Flex className="gap-x-2" direction="row" align="center" justify="start">
        {(Object.keys(integrations) as Array<IntegrationsPlatforms>).reduce<
          ReactNode[]
        >((acc, key) => {
          if (integrations[key].isConnected) acc.push(integrationsLogo[key])

          return acc
        }, [])}
      </Flex>
    )
  }, [integrations])

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger>
        <StatisticCard className={cn(!isEmptyIntegrations && 'gap-x-3')}>
          <Icons.Integrations width={18} height={18} />
          {isEmptyIntegrations ? 'Нет подключений' : connectedIntegrationsLogos}
        </StatisticCard>
      </TooltipTrigger>
      <TooltipContent>
        <Typography tag="span" className="text-gray-accent">
          Подключенные к аукциону интеграции
        </Typography>
      </TooltipContent>
    </Tooltip>
  )
})
