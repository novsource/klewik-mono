import { useMemo } from 'react'

import { CreateSlotsDialog } from '~features/auction-slot/create-slots/ui'
import { SlotsCountStatisticCard, SlotsPointsSumStatisticCard } from '~features/auction-slot/watch-statistics/ui'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { MediaQueryViewToggler } from '~shared/components/media-query-view-toggler'

import { useDocumentTitle, useMediaQuery } from '~shared/hooks'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { cn, twSlotsStyles } from '~shared/utils'

import { auctionSlotsPageStyles } from '../styles'
import { SortingSlotsCombobox } from './combobox/sorting-slots-combobox.ui'
import { AuctionSlotsVirtualList } from './virtual-lists/slots-virtual-list.ui'

export const AuctionSlotsPage = () => {
  useDocumentTitle('Слоты | Поинтовый аукцион Klewik')

  const pageStyles = useMemo(() => twSlotsStyles(auctionSlotsPageStyles), [])

  return (
    <div
      className={pageStyles.base}
    >
      <MediaQueryViewToggler query={greaterThenDeviceWidthMediaQueries.tablet}>
        <MediaQueryViewToggler.MatchedItem>
          <Flex
            className={pageStyles.contentWrapper}
            wrap="nowrap"
            align="center"
            justify="end"
          >
            <PageTitle />
          </Flex>
        </MediaQueryViewToggler.MatchedItem>
      </MediaQueryViewToggler>

      <ListActionsPanel />
      <AuctionSlotsVirtualList />
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
        <SortingSlotsCombobox />
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
      <SortingSlotsCombobox />
    </Flex>
  )
}
