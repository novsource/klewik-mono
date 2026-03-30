import type { ReactNode } from 'react'

import { Link } from 'react-router-dom'

import NumberFlow from '@number-flow/react'

import { useUpdateBetsStatusMutation } from '~features/auction/update-bets-status/api'

import { ConnectedIntegrationsStatisticCard } from '~features/integrations/show-connected-integrations/ui'

import { auctionSelectors } from '~entities/auction/store'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { donationsSelectors } from '~entities/donation/store'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from 'klewik-ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from 'klewik-ui/drawer'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import { SheetHeader } from 'klewik-ui/sheet'
import { Switch } from 'klewik-ui/switch'
import { Typography } from 'klewik-ui/typography'

import { cn } from '~shared/utils'

export const MobileMenu = () => {
  return (
    <Drawer>
      <DrawerTrigger
        nativeButton={false}
        render={(
          <Button
            variant="ghost"
            className={cn(
              'flex flex-col items-center justify-start gap-y-0.25 w-full text-[11px] font-regular h-full px-4 text-gray/50',
            )}
          >
            <div className="flex size-5 justify-center">
              <Icons.Hamburger />
            </div>
            Меню
          </Button>
        )}
      />
      <DrawerContent slotClassnames={{ content: 'm-0 h-full max-w-none', popup: 'max-w-[65%]' }}>
        <Flex className="h-full" direction="column">

          <SheetHeader className="space-y-0">
            <Flex className="flex-col w-full gap-y-2 mobile:gap-x-4 mobile:flex-row">
              <SlotsStatisticCard className="justify-start grow" />
              <SlotsPointsSumStatisticCard className="justify-start grow" />
              <DonationsStatsCard className="grow" />
            </Flex>
            <ConnectedIntegrationsStatisticCard />
            <BetsStatusSwitcher />
          </SheetHeader>

          {/* <Divider className="my-4" /> */}

          {/* <OpenSettingsDialogButton /> */}

          <Flex className="h-full gap-y-8" justify="end" direction="column">
            <Flex className="h-full gap-y-4 mobile:gap-y-6" direction="column" justify="end">
              <Link className="flex gap-x-2 text-gray-light text-sm mobile:text-md" to="#">
                Страница для зрителей
                <Icons.LinkArrow size="sm" />
              </Link>
              <Link className="flex gap-x-2 text-gray-light text-sm mobile:text-md" to="#">
                Документация
                <Icons.LinkArrow size="sm" />
              </Link>
            </Flex>

            <Button className="w-full" variant="error" size="sm">Выйти из аукциона</Button>

          </Flex>
        </Flex>

      </DrawerContent>
    </Drawer>
  )
}

function BetsStatusSwitcher() {
  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)
  const isBetsClosed = useStoreSelector(auctionSelectors.getIsBetsClosed)

  const [betsStatusMutation, { isLoading }] = useUpdateBetsStatusMutation()

  const isMediaLargeThenMobile = useMediaQuery(greaterThenDeviceWidthMediaQueries.mobile)

  const handleCheckedChange = async () => {
    if (isLoading)
      return

    betsStatusMutation({ auctionUUID, status: !isBetsClosed })
  }

  return (
    <StatisticCard className="items-center">
      <Flex className="w-full justify-between" align="center">
        <Flex className="gap-x-2" align="center">
          <Icons.OpenBets size="sm" />
          <Typography className="font-semibold text-sm mobile:text-md" tag="span">
            Прием ставок
          </Typography>
        </Flex>
        <Switch
          defaultChecked
          onCheckedChange={handleCheckedChange}
          disabled={isLoading}
          size={isMediaLargeThenMobile ? 'default' : 'sm'}
        />
      </Flex>
    </StatisticCard>
  )
}

function SlotsStatisticCard(props: DomainCardProps) {
  const slots = useStoreSelector(auctionSlotsSelectors.getSlots)

  return (
    <StatisticCard className={props.className} title="Количество слотов">
      <Flex className="gap-x-2">
        <Icons.Slots size="sm" />
        <NumberFlow
          className="font-azeret-mono font-medium tracking-tight"
          willChange
          value={slots.length}
        />
      </Flex>
    </StatisticCard>
  )
}

function SlotsPointsSumStatisticCard(props: DomainCardProps) {
  const sum = useStoreSelector(auctionSlotsSelectors.getSlotsPointsSum)

  return (
    <StatisticCard className={props.className} title="Количество очков">
      <Flex className="gap-x-2">
        <Icons.PointsSum size="default" />
        <NumberFlow
          className="font-azeret-mono font-medium tracking-tight"
          willChange
          value={sum}
          locales="ru-RU"
        />
      </Flex>
    </StatisticCard>
  )
}

type DomainCardProps = {
  className?: string
}

function StatisticCard(props: {
  children: ReactNode
  className?: string
  title?: string
}) {
  const { className, title, children } = props

  return (
    <Flex
      className={cn(
        'h-fit min-h-9 gap-y-1 mobile:gap-y-1.5 rounded-md bg-dark px-2.5 py-1.5 text-sm leading-5 font-semibold text-gray-accent text-nowrap mobile:text-md',
        className,
      )}
      align="start"
      justify="center"
      direction={title ? 'column' : 'row'}
    >
      {title && <Typography className="text-sm font-semibold text-gray-light tracking-tight" tag="span">{title}</Typography>}
      {children}
    </Flex>
  )
}

function DonationsStatsCard(props: DomainCardProps) {
  const { className } = props

  const statusesCount = useStoreSelector(donationsSelectors.getDonationsStatusesCounts)

  return (
    <StatisticCard className={className} title="Пожертвования">
      <Flex className="w-full h-full gap-x-2.5" justify="between">
        <Flex className="gap-x-1" align="center">
          <Icons.Success size="sm" />
          <NumberFlow
            className="font-azeret-mono font-medium tracking-tight"
            value={statusesCount.added}
          />
        </Flex>
        <Flex className="gap-x-1" align="center">
          <Icons.Warning width="16" height="16" />
          <NumberFlow
            className="font-azeret-mono font-medium tracking-tight"
            value={statusesCount.checkRequested}
          />
        </Flex>
        <Flex className="gap-x-0.5" align="center">
          <Icons.LargeCross size="sm" />
          <NumberFlow
            className="font-azeret-mono font-medium tracking-tight"
            value={statusesCount.error}
          />
        </Flex>
      </Flex>
    </StatisticCard>
  )
}
