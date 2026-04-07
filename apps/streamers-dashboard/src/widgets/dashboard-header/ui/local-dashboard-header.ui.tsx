import type { ComponentProps, ComponentPropsWithoutRef, ReactNode } from 'react'
import { memo, useMemo } from 'react'

import { useLocation } from 'react-router-dom'

import NumberFlow from '@number-flow/react'
import { DividedLayout } from '~shared/layouts/divided-layout'

import { globalDialogsActions } from '~app/components/global-dialogs/store/global-dialogs.slice'

import { SearchDialog } from '~widgets/search-dialog/ui'

import { ExportSlotsPopover } from '~features/auction-slot/export-slots/ui'

import { auctionSelectors } from '~entities/auction/store'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import type { IntegrationsPlatforms } from '~entities/integrations/model'
import { integrationsSelectors } from '~entities/integrations/store'

import { ROUTES_TITLES } from '~shared/constants/router'
import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { MediaQueryViewToggler } from '~shared/components/media-query-view-toggler'
import { Title } from '~shared/components/typography'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from 'klewik-ui/button'
import { Divider } from 'klewik-ui/divider'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import { MotionBox } from 'klewik-ui/motion-box'

import { cn } from '~shared/utils'

export type DashboardHeaderProps = ComponentPropsWithoutRef<typeof BaseHeader>

export const LocalDashboardHeader = memo((props: DashboardHeaderProps) => {
  const { children, className, ...restProps } = props

  return (
    <BaseHeader
      className={cn([
        'z-50 top-0 sticky max-tablet:w-full max-tablet:h-14',
        'bg-dark-foreground tablet:bg-dark-foreground/10 tablet:backdrop-blur-xs',
        className,
      ])}
      {...restProps}
    >
      <Flex className="w-full h-full gap-x-4 px-4" align="center">
        <MediaQueryViewToggler query={greaterThenDeviceWidthMediaQueries.tablet}>
          <MediaQueryViewToggler.MatchedItem>
            <DesktopLocalDashboardHeader />
          </MediaQueryViewToggler.MatchedItem>
        </MediaQueryViewToggler>

        <MediaQueryViewToggler.NotMatchedItem>
          <MobileLocalDashboardHeader />
        </MediaQueryViewToggler.NotMatchedItem>
      </Flex>
      {children}
    </BaseHeader>
  )
})

type BaseHeaderProps = ComponentProps<'header'>

function BaseHeader(props: BaseHeaderProps) {
  const { className, children, ...restProps } = props

  return (
    <header className={cn('h-fit w-full', className)} {...restProps}>
      <Flex
        className="h-full w-full gap-x-4 tablet:pt-4"
        align="center"
        justify="between"
      >
        {children}
      </Flex>
    </header>
  )
}

function DesktopLocalDashboardHeader() {
  return (
    <DividedLayout slotClassnames={{ container: 'w-full flex h-8 items-center justify-end' }} gap={8}>

      <div className="flex h-full gap-x-1.5">
        <SlotsPointsSumStatisticCard />
        <SlotsStatisticCard />
        <SlotsStatusesStatisticCard />
        <IntegrationsStatisticCard />
      </div>

      <ExportSlotsPopover size="sm" />
    </DividedLayout>

  )
}

function MobileLocalDashboardHeader() {
  const { setDialogOpenStatus } = useActionCreators(globalDialogsActions)

  const openSearchDialog = () => {
    setDialogOpenStatus({ dialog: 'search', status: true })
  }

  const openSettingsDialog = () => {
    setDialogOpenStatus({ dialog: 'settings', status: true })
  }

  return (
    <div className="w-full h-full">
      <Flex className="w-full h-full gap-x-1.5 pt-2" align="center" justify="between">
        <MobilePageTitle />

        <div className="inline-flex h-full gap-x-2.5 mobile:gap-x-4 items-center">
          <SearchDialog trigger={(
            <Button
              className="text-gray-light active:text-gray-accent"
              icon={<Icons.Magnifier size="sm" />}
              isIconOnly
              size="sm"
              onClick={openSearchDialog}
            />
          )}
          />
          <Button
            className="text-gray-light active:text-gray-accent"
            icon={<Icons.Settings size="sm" />}
            isIconOnly
            size="sm"
            onClick={openSettingsDialog}
          />
        </div>
      </Flex>
    </div>
  )
}

function MobilePageTitle() {
  const { pathname } = useLocation()

  const pageTitle = useMemo(() => {
    const route = pathname.split('/').at(3) || 'slots'

    return route in ROUTES_TITLES ? ROUTES_TITLES[route as keyof typeof ROUTES_TITLES] : ''
  }, [pathname])

  return (
    <MotionBox initial={{ height: 0 }} animate={{ height: 'auto' }}>
      <Title order={2}>{pageTitle}</Title>
    </MotionBox>
  )
}

type BaseStatisticCardProps = {
  children: ReactNode
  className?: string
}

function StatisticCard(props: BaseStatisticCardProps) {
  const { className, children } = props

  return (
    <Flex
      className={cn(
        'h-8 gap-x-1.5 rounded-md bg-dark px-2.5 py-1.5 text-md leading-5 font-semibold text-gray-accent text-nowrap',
        className,
      )}
      align="center"
      justify="center"
    >
      {children}
    </Flex>
  )
}

type SlotsStatisticCardProps = {
  className?: string
}

function SlotsStatisticCard(props: SlotsStatisticCardProps) {
  const slots = useStoreSelector(auctionSlotsSelectors.getSlots)

  return (
    <StatisticCard {...props}>
      <Icons.Slots size="xs" />
      <NumberFlow
        className="font-azeret-mono font-medium tracking-tight text-md"
        willChange
        value={slots.length}
      />
    </StatisticCard>
  )
}

type SlotsPointsSumStatisticCardProps = {
  className?: string
}

function SlotsPointsSumStatisticCard(props: SlotsPointsSumStatisticCardProps) {
  const sum = useStoreSelector(auctionSlotsSelectors.getSlotsPointsSum)

  return (
    <StatisticCard {...props}>
      <Icons.PointsSum size="sm" />
      <NumberFlow
        className="font-azeret-mono font-medium tracking-tight text-md"
        willChange
        value={sum}
        locales="ru-RU"
      />
    </StatisticCard>
  )
}

type IntegrationsStatisticCardProps = {
  className?: string
}

function IntegrationsStatisticCard(props: IntegrationsStatisticCardProps) {
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
    <StatisticCard className={cn(!connectedIntegrationsCount && 'gap-x-2', props.className)}>
      <Icons.Integrations width={18} height={18} />
      {connectedIntegrationsCount === 0 ? 'Нет интеграций' : `${connectedIntegrationsCount} подключено`}
    </StatisticCard>
  )
}

type SlotsStatusesStatisticCardProps = {
  className?: string
}

function SlotsStatusesStatisticCard(props: SlotsStatusesStatisticCardProps) {
  const { className } = props

  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const winnerId = useStoreSelector(auctionSelectors.getWinnerId)

  const statuses = useMemo(() => {
    if (winnerId) {
      return { alived: [], dropped: auctionSlots }
    }

    return auctionSlots.reduce((acc, slot) => {
      if (slot.isAlived) {
        acc.alived.push(slot)
      }
      else {
        acc.dropped.push(slot)
      }

      return acc
    }, { alived: [], dropped: [] } as Record<'alived' | 'dropped', AuctionSlot[]>)
  }, [auctionSlots, winnerId])

  return (
    <StatisticCard className={cn('h-full', className)}>
      <div className="flex gap-x-1.5 items-center">
        <Icons.Heart className="text-red" size="xs" />
        <NumberFlow
          className="font-azeret-mono font-medium tracking-tight text-md"
          willChange
          value={statuses.alived.length}
        />
      </div>

      <Divider className="mx-1.5" orientation="vertical" />

      <div className="flex gap-x-1.5 items-center">
        <Icons.BrokenHeart className="text-gray-light" size="xs" />
        <NumberFlow
          className="font-azeret-mono font-medium tracking-tight text-md"
          willChange
          value={statuses.dropped.length}
        />
      </div>
    </StatisticCard>
  )
}
