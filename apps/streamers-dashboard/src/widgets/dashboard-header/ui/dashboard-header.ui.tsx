import type { ComponentProps, ReactNode } from 'react'
import { memo, useMemo, useState } from 'react'

import NumberFlow from '@number-flow/react'
import { globalDialogsActions } from '~features/_common/display-dialogs'
import { AnimatePresence } from 'motion/react'

import { SearchDialog } from '~widgets/search-dialog/ui'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import type { IntegrationsPlatforms } from '~entities/integrations/model'
import { integrationsSelectors } from '~entities/integrations/store'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Divider } from '~shared/ui/divider'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '~shared/ui/tooltip'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

import { DashboardHeaderMenu } from '../../dashboard-header-menu/ui/dashboard-header-menu.ui'
import { AuctionTimer } from './auction-timer'
import { DonationsStats } from './donations-stats'

const Header = ({ children, ...otherProps }: ComponentProps<'header'>) => {
  return (
    <header className="h-fit w-full pt-4" {...otherProps}>
      <Flex
        className="h-full w-full gap-x-4"
        align="center"
        justify="between"
      >
        {children}
      </Flex>
    </header>
  )
}

const StatisticCard = (props: {
  className?: string
  children: ReactNode
}) => {
  const { className, children } = props

  return (
    <Flex
      className={cn(
        'h-9 gap-x-1.5 rounded-md bg-dark px-2.5 py-1.5 text-md leading-5 font-semibold text-gray-accent text-nowrap',
        className,
      )}
      align="center"
      justify="center"
    >
      {children}
    </Flex>
  )
}

const SlotsStatisticCard = memo((props: { className?: string }) => {
  const slots = useStoreSelector(auctionSlotsSelectors.getSlots)

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger>
        <StatisticCard className={props.className}>
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

const SlotsPointsSumStatisticCard = memo((props: { className?: string }) => {
  const sum = useStoreSelector(auctionSlotsSelectors.getSlotsPointsSum)

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger>
        <StatisticCard className={props.className}>
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

const IntegrationsStatisticCard = memo((props: { className?: string }) => {
  const integrations = useStoreSelector(
    integrationsSelectors.getAllIntegrationsStatuses,
  )

  const connectedIntegrationsCount = useMemo(() => {
    return (Object.keys(integrations) as Array<IntegrationsPlatforms>).reduce(
      (acc, key) => {
        if (integrations[key].isConnected)
          acc++

        return acc
      },
      0,
    )
  }, [integrations])

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger>
        <StatisticCard className={cn(!connectedIntegrationsCount && 'gap-x-3', props.className)}>
          <Icons.Integrations width={18} height={18} />
          {connectedIntegrationsCount === 0 ? 'Нет интеграций' : `${connectedIntegrationsCount} подключено`}
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

export type DashboardHeaderProps = {
  children?: ReactNode
}

export const DashboardHeader = memo((props: DashboardHeaderProps) => {
  const { children } = props

  const [isTimerVisible, setIsTimerVisible] = useState(false)

  const { setDialogOpenStatus } = useActionCreators(globalDialogsActions)

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  const toggleTimerVision = () => {
    setIsTimerVisible(curr => !curr)
  }

  const openSearchDialog = () => {
    setDialogOpenStatus({ dialog: 'search', status: true })
  }

  return (
    <Header className={cn([
      'z-50 top-0 sticky max-tablet:w-full max-tablet:bg-dark max-tablet:border-b-1 max-tablet:border-dark-accent/50 max-tablet:h-12',
      'tablet:bg-dark-foreground/10 tablet:backdrop-blur-xs',
    ])}
    >
      <Flex className="w-full h-full gap-x-4 px-4" align="center">
        <Flex className="w-full h-9.5" align="center" justify="end">
          {isLargeThenTablet && (
            <>
              <Flex align="center" justify="center">
                <SlotsStatisticCard />
                <SlotsPointsSumStatisticCard className="ml-1.5" />
                <DonationsStats className="ml-1.5" />
                <IntegrationsStatisticCard className="ml-1.5" />
                <AnimatePresence>
                  {isTimerVisible && <AuctionTimer className="ml-1.5" />}
                </AnimatePresence>
              </Flex>
              <Divider className="mx-4" orientation="vertical" />
            </>
          )}

          <Flex className="w-full h-full tablet:w-fit gap-x-1.5" align="center" justify="end">
            <SearchDialog trigger={(
              <Button
                variant="ghost"
                className={cn(
                  'w-full text-gray bg-dark-light justify-start text-sm h-9',
                  isLargeThenTablet && 'bg-dark font-medium text-gray pr-4 pl-2.5 hover:text-gray-light/80 hover:bg-dark-light/80',
                )}
                startContent={<Icons.Magnifier size="xs" />}
                size={isLargeThenTablet ? 'xs' : 'default'}
                onClick={openSearchDialog}
              >
                Поиск по аукциону...
              </Button>
            )}
            />
            {isLargeThenTablet && (
              <DashboardHeaderMenu
                isTimerVisible={isTimerVisible}
                onTimerVisibilityChanges={toggleTimerVision}
              />
            ) }
          </Flex>
        </Flex>
      </Flex>
      {children}
    </Header>
  )
})
