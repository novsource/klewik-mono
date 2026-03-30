import { useMemo } from 'react'

import { CreateSlotsDialog } from '~features/auction-slot/create-slots/ui'
import { ExportSlotsPopover } from '~features/auction-slot/export-slots/ui'
import { SlotsCountStatisticCard, SlotsPointsSumStatisticCard } from '~features/auction-slot/watch-statistics/ui'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { MediaQueryViewToggler } from '~shared/components/media-query-view-toggler'

import { useDocumentTitle } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from 'klewik-ui/button'
import { Divider } from 'klewik-ui/divider'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import { Typography } from 'klewik-ui/typography'

import { cn, twSlotsStyles } from '~shared/utils'

import { SlotsPageContextProvider, useSlotsPageContext } from '../context/slots-page.context'
import { useLocalFilterSlots } from '../hooks/use-local-filter-slots'
import { auctionSlotsPageStyles } from '../styles'
import { FilterSlotsStatusSelect } from './combobox/filter-status-select.ui'
import { SortingSlotsCombobox } from './combobox/sorting-slots-combobox.ui'
import { AuctionSlotsVirtualList } from './virtual-lists/slots-virtual-list.ui'

export const AuctionSlotsPage = () => {
  useDocumentTitle('Слоты | Поинтовый аукцион Klewik')

  const classes = useMemo(() => twSlotsStyles(auctionSlotsPageStyles), [])

  return (
    <div className={classes.base}>
      <SlotsPageContextProvider>
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

        <PageContent />
      </SlotsPageContextProvider>
    </div>
  )
}

function PageTitle() {
  const classes = useMemo(() => cn(auctionSlotsPageStyles.actionPanel), [])

  return (
    <div className="w-full flex gap-x-6 items-center">
      <div className="h-fit w-fit rounded-small bg-green-accent/50 p-0.5 outline-4 outline-green-accent/15">
        <Flex
          className="relative size-10 tablet:size-11.5 rounded-small p-1.25"
          align="center"
          justify="center"
        >
          <Icons.Slots
            className="text-white-accent"
            width={32}
            height={32}
            gradient
          />
        </Flex>
      </div>

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
    </div>
  )
}

function PageContent() {
  const storedAuctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const { state: { filterSlotsOptions } } = useSlotsPageContext()

  const localFilteredSlots = useLocalFilterSlots(storedAuctionSlots, filterSlotsOptions)

  return (
    <>
      <SlotsListActionsPanel />
      <AuctionSlotsVirtualList data={localFilteredSlots} />
    </>
  )
}

type ListActionsPanelProps = {
  disabled?: boolean
}

function SlotsListActionsPanel(props: ListActionsPanelProps) {
  const { disabled } = props

  return (
    <MediaQueryViewToggler query={greaterThenDeviceWidthMediaQueries.tablet}>
      <MediaQueryViewToggler.MatchedItem>
        <div className="w-full h-10 flex justify-between items-center gap-x-1 mb-4">
          <div className="flex gap-x-2 justify-center items-center">
            <SortingSlotsCombobox />
            <FilterSlotsStatusSelect />
          </div>

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

          <div className="flex gap-x-3.5">
            <SortingSlotsCombobox />
          </div>
        </Flex>
      </MediaQueryViewToggler.NotMatchedItem>
    </MediaQueryViewToggler>
  )
}
