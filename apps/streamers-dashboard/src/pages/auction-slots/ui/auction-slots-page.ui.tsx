import { useMemo } from 'react'

import { CreateSlotsDialog } from '~features/auction-slot/create-slots/ui'
import { SlotsCountStatisticCard, SlotsPointsSumStatisticCard } from '~features/auction-slot/watch-statistics/ui'

import { SkeletonAuctionSlotCard } from '~entities/auction-slot/ui/card'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useDocumentTitle, useDumbedTransition, useMediaQuery } from '~shared/hooks'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { cn, twSlotsStyles } from '~shared/utils'

import { auctionSlotsPageStyles } from '../styles'
import { SortingSlotsCombobox } from './combobox/sorting-slots-combobox.ui'
import { AuctionSlotsVirtualList } from './virtual-lists/slots-virtual-list.ui'

export const AuctionSlotsPage = () => {
  const pageStyles = useMemo(() => twSlotsStyles(auctionSlotsPageStyles), [])

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  const isListShowed = useDumbedTransition()

  useDocumentTitle('Слоты | Поинтовый аукцион Klewik')

  return (
    <div
      className={pageStyles.base}
    >
      {isLargeThenTablet && (
        <Flex
          className={pageStyles.contentWrapper}
          wrap="nowrap"
          align="center"
          justify="end"
        >
          <PageTitle />
        </Flex>
      )}
      <ListActionsPanel disabled={!isListShowed} />
      <AuctionSlotsList isShowed={isListShowed} />
    </div>
  )
}

function PageTitle() {
  const classes = useMemo(() => cn(auctionSlotsPageStyles.actionPanel), [])

  return (
    <Flex className={classes} align="start" direction="column">
      <Typography
        className="tablet:text-title-xl desktop:text-title-2xl overflow-clip"
        tag="h1"
      >
        Слоты
      </Typography>
      <Typography
        className="text-gray/80 max-tablet:text-sm"
        tag="span"
      >
        Просмотр, добавление и изменение слотов в аукционе
      </Typography>
    </Flex>
  )
}

type ListActionsPanelProps = {
  disabled?: boolean
}

function ListActionsPanel(props: ListActionsPanelProps) {
  const { disabled } = props

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  if (isLargeThenTablet) {
    return (
      <Flex className="w-full gap-x-2 mb-4" justify="end">
        <SortingSlotsCombobox disabled={disabled} />
        <CreateSlotsDialog
          multiplySlots
          trigger={(
            <Button
              className="z-50 w-full max-tablet:hidden"
              variant="action"
              startContent={<Icons.Plus size="sm" />}
              disabled={disabled}
            >
              Добавить слоты
            </Button>
          )}
        />
      </Flex>
    )
  }

  return (
    <Flex className="mt-3.5" justify="between">
      <Flex className="gap-x-1.5">
        <SlotsCountStatisticCard />
        <SlotsPointsSumStatisticCard />
      </Flex>
      <SortingSlotsCombobox disabled={disabled} />
    </Flex>
  )
}

type AuctionSlotsVirtualListProps = {
  isShowed: boolean
}

function AuctionSlotsList(props: AuctionSlotsVirtualListProps) {
  const { isShowed } = props

  if (!isShowed)
    return <SkeletonVirtualList />

  return <AuctionSlotsVirtualList />
}

function SkeletonVirtualList() {
  return Array.from({ length: 30 }).fill(null).map((_, index) =>
    <SkeletonAuctionSlotCard key={index} style={{ marginTop: index !== 0 ? 4 : 0 }} />)
}
