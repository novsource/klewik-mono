import { useMemo } from 'react'

import { CreateSlotsDialog } from '~features/auction-slot/create-slots/ui'
import { SlotsCountStatisticCard, SlotsPointsSumStatisticCard } from '~features/auction-slot/watch-statistics/ui'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import { Button } from '~shared/ui/button'
import { Divider } from '~shared/ui/divider'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { twSlotsStyles } from '~shared/utils'

import { auctionSlotsPageStyles } from '../styles'
import { AuctionSlotsList } from './slots-list.ui'
import { SortingSlotsCombobox } from './sorting-slots-combobox.ui'

export const AuctionSlotsPage = () => {
  const pageStyles = useMemo(() => twSlotsStyles(auctionSlotsPageStyles), [])

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  return (
    <div
      className={pageStyles.base}
    >
      <Flex
        className={pageStyles.contentWrapper}
        wrap="nowrap"
        align="center"
        justify="end"
      >
        <Flex className={pageStyles.actionPanel} align="center" justify="between">
          <Typography className="tablet:text-title-xl" tag="h1">Слоты</Typography>
          {isLargeThenTablet && (
            <Flex className="gap-x-2">
              <SortingSlotsCombobox />
              <CreateSlotsDialog
                multiplySlots
                trigger={(
                  <Button
                    className="z-50 w-full max-tablet:hidden"
                    variant="action"
                    startContent={<Icons.Plus />}
                  >
                    Добавить слоты
                  </Button>
                )}
              />
            </Flex>
          )}
        </Flex>
      </Flex>
      {!isLargeThenTablet && (
        <Flex className="mt-3.5" justify="between">
          <Flex className="gap-x-1.5">
            <SlotsCountStatisticCard />
            <SlotsPointsSumStatisticCard />
          </Flex>
          <SortingSlotsCombobox />
        </Flex>
      )}
      <Divider className="border-gray/10 mt-1.5 mb-3" />
      <AuctionSlotsList />
    </div>
  )
}
