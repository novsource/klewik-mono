import { ReactNode, memo, useMemo } from 'react'
import { ComponentProps } from 'react'
import { NavLink } from 'react-router-dom'

import { IntegrationsPlatforms } from '~entities/integrations/model'
import { integrationsSelectors } from '~entities/integrations/store'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import { Icons } from '~shared/ui/icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '~shared/ui/tooltip'
import { Typography } from '~shared/ui/typograghy'

import { tailwindScreens } from '~shared/constants/tailwindcss'

import { cn } from '~shared/utils'

export const DashboardHeader = memo(({ children }: { children: ReactNode }) => {
  const isLargeThenTablet = useMediaQuery(
    `(min-width:${tailwindScreens.tablet})`
  )

  return (
    <Header>
      <div className="flex gap-x-1.5 items-center justify-center">
        {isLargeThenTablet && (
          <>
            <SlotsStatisticCard />
            <SlotsPointsSumStatisticCard />
            <IntegrationsStatisticCard />
          </>
        )}
      </div>
      {children}
    </Header>
  )
})

const Header = ({ children, ...otherProps }: ComponentProps<'header'>) => {
  return (
    <header className="h-16 w-full" {...otherProps}>
      <div className="flex h-full w-full items-center justify-between gap-x-4 px-4">
        <NavLink to={'/'}>
          <Icons.Logo className="text-green-accent" width={28} height={28} />
        </NavLink>
        {children}
      </div>
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
    <div
      className={cn(
        'flex items-center justify-center gap-x-1.5 py-2 px-3 bg-dark rounded-md font-golos-f text-md font-medium leading-5 text-gray-accent',
        className
      )}
    >
      {children}
    </div>
  )
}

const SlotsStatisticCard = memo(() => {
  const slots = useStoreSelector(auctionSlotsSelectors.getSlots)

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger>
        <StatisticCard>
          <Icons.Slots width={18} height={18} />
          {slots.length}
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
          <Icons.PointsSum width={20} height={20} />
          {Intl.NumberFormat('ru-RU').format(sum)}
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
    'donation-alerts': <Icons.DonationAlerts width={14} height={20} />,
    'donate-pay': <Icons.DonatePay />,
  }

  const connectedIntegrationsLogos = useMemo(() => {
    return (
      <div className="flex flex-row gap-x-2 items-center justify-start">
        {(Object.keys(integrations) as Array<IntegrationsPlatforms>).reduce<
          ReactNode[]
        >((acc, key) => {
          if (integrations[key].isConnected) acc.push(integrationsLogo[key])

          return acc
        }, [])}
      </div>
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
