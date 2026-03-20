import { useMemo } from 'react'

import { CreateSlotsDialog } from '~features/auction-slot/create-slots/ui'
import { ExportSlotsPopover } from '~features/auction-slot/export-slots/ui'
import { SlotsCountStatisticCard, SlotsPointsSumStatisticCard } from '~features/auction-slot/watch-statistics/ui'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { MediaQueryViewToggler } from '~shared/components/media-query-view-toggler'

import { useDocumentTitle } from '~shared/hooks'

import { Button } from '~shared/ui/button'
import { Divider } from '~shared/ui/divider'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { cn, twSlotsStyles } from '~shared/utils'

import { auctionSlotsPageStyles } from '../styles'
import { SortingSlotsCombobox } from './combobox/sorting-slots-combobox.ui'
import { AuctionSlotsVirtualList } from './virtual-lists/slots-virtual-list.ui'

export const AuctionSlotsPage = () => {
  useDocumentTitle('Слоты | Поинтовый аукцион Klewik')

  const classes = useMemo(() => twSlotsStyles(auctionSlotsPageStyles), [])

  return (
    <div
      className={classes.base}
    >
      <MediaQueryViewToggler query={greaterThenDeviceWidthMediaQueries.tablet}>
        <MediaQueryViewToggler.MatchedItem>
          <Flex
            className={classes.contentWrapper}
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

  return (
    <MediaQueryViewToggler query={greaterThenDeviceWidthMediaQueries.tablet}>
      <MediaQueryViewToggler.MatchedItem>
        <div className="w-full h-10 flex justify-between items-center gap-x-1 mb-4">
          <SortingSlotsCombobox />

          <Flex className="w-full h-full gap-x-2 items-center" justify="end">
            <ExportSlotsPopover />

            <Divider className="mx-1.5" orientation="vertical" />

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
        </div>
      </MediaQueryViewToggler.MatchedItem>

      <MediaQueryViewToggler.NotMatchedItem>
        <Flex className="mt-3.5" justify="between">
          <Flex className="gap-x-1.5">
            <SlotsCountStatisticCard />
            <SlotsPointsSumStatisticCard />
          </Flex>
          <SortingSlotsCombobox />
        </Flex>
      </MediaQueryViewToggler.NotMatchedItem>
    </MediaQueryViewToggler>
  )
}
