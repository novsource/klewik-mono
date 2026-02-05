import type { ComponentProps, ComponentPropsWithoutRef, ReactNode } from 'react'
import { memo, useMemo, useState } from 'react'

import { useLocation } from 'react-router-dom'

import NumberFlow from '@number-flow/react'
import { CopyToClipboardButton } from '~features/_common/copy-to-clipboard'

import { globalDialogsActions } from '~app/components/global-dialogs/store/global-dialogs.slice'

import { SearchDialog } from '~widgets/search-dialog/ui'

import { auctionSelectors } from '~entities/auction/store'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import type { IntegrationsPlatforms } from '~entities/integrations/model'
import { integrationsSelectors } from '~entities/integrations/store'

import { ROUTES_TITLES } from '~shared/constants/router'
import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { MediaQueryViewToggler } from '~shared/components/media-query-view-toggler'
import { Text } from '~shared/components/typography'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Divider } from '~shared/ui/divider'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { MotionBox } from '~shared/ui/motion-box'
import { Popover, PopoverContent, PopoverTrigger } from '~shared/ui/popover'
import { toastSuccessNotification } from '~shared/ui/toaster/lib'
import { Tooltip, TooltipContent, TooltipTrigger } from '~shared/ui/tooltip'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

import { DonationsStats } from './donations-stats'

export type DashboardHeaderProps = ComponentPropsWithoutRef<typeof BaseHeader>

export const DashboardHeader = memo((props: DashboardHeaderProps) => {
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
            <DesktopDashboardHeader />
          </MediaQueryViewToggler.MatchedItem>
        </MediaQueryViewToggler>

        <MediaQueryViewToggler.NotMatchedItem>
          <MobileDashboardHeader />
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
    <header className={cn('h-fit w-full tablet:pt-4', className)} {...restProps}>
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

function DesktopDashboardHeader() {
  const [isTimerVisible, setIsTimerVisible] = useState(false)

  const uuid = useStoreSelector(auctionSelectors.getAuctionUUID)

  const { setDialogOpenStatus } = useActionCreators(globalDialogsActions)

  const toggleTimerVisibility = () => {
    setIsTimerVisible(curr => !curr)
  }

  const openSettingsDialog = () => {
    setDialogOpenStatus({ dialog: 'settings', status: true })
  }

  const openSearchDialog = () => {
    setDialogOpenStatus({ dialog: 'search', status: true })
  }

  return (
    <Flex className="w-full h-8" align="center" justify="end">
      <Flex align="center" justify="center">
        <SlotsStatisticCard />
        <SlotsPointsSumStatisticCard className="ml-1.5" />
        <DonationsStats className="ml-1.5" />
        <IntegrationsStatisticCard className="ml-1.5" />
      </Flex>

      <Divider className="mx-4" orientation="vertical" />

      <Flex className="w-full h-full tablet:w-fit gap-x-1.5" align="center" justify="end">

        <SearchDialog trigger={(
          <Button
            variant="borderless"
            className="w-52 bg-dark font-medium text-gray pr-4 pl-2.5 hover:text-gray-light/80 hover:bg-dark-light/80 justify-start h-full"
            startContent={<Icons.Magnifier size="xs" />}
            size="sm"
            onClick={openSearchDialog}
          >
            Поиск по аукциону...
          </Button>
        )}
        />

        <Button size="sm" startContent={<Icons.List />}>
          Правила
        </Button>

        <Popover>
          <PopoverTrigger render={<Button isIconOnly icon={<Icons.Share />} size="sm" />} />
          <PopoverContent className="w-fit px-5 py-2" positionerProps={{ align: 'end', sideOffset: 8 }}>
            <Text className="text-gray-accent mb-2">
              Ссылка на аукцион для зрителей
            </Text>
            <div className="flex w-full text-white/80 text-md pl-2 py-0.25 bg-dark-accent rounded-small font-semibold items-center justify-between">
              {`https://auction.klewik.ru/${uuid}`}
              <CopyToClipboardButton
                className="pointer-events-auto"
                value={`https://auction.klewik.ru/${uuid}`}
                onClick={() => {
                  toastSuccessNotification('Ссылка успешно скопирована!')
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
        <Button isIconOnly icon={<Icons.Settings />} size="sm" onClick={openSettingsDialog} />
      </Flex>
    </Flex>
  )
}

function MobileDashboardHeader() {
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

    return route in ROUTES_TITLES ? ROUTES_TITLES[route]! : ''
  }, [pathname])

  return (
    <MotionBox initial={{ height: 0 }} animate={{ height: 'auto' }}>
      <Typography tag="h2">{pageTitle }</Typography>
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
    <Tooltip delayDuration={500}>
      <TooltipTrigger>
        <StatisticCard className={cn(!connectedIntegrationsCount && 'gap-x-2', props.className)}>
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
}
