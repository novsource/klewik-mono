import { useMemo } from 'react'

import { CreateSlotsDialog } from '~widgets/create-slots-dialog/ui'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

import { twSlotsStyles } from '~shared/utils'

import { auctionSlotsPageStyles } from '../styles'
import { AuctionSlotsList } from './slots-list/slots-list.ui'
import { SortingSlotsCombobox } from './sorting-slots-combobox'

const AuctionSlotsPage = () => {
  const pageStyles = useMemo(() => twSlotsStyles(auctionSlotsPageStyles), [])

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
      </Flex>
      <AuctionSlotsList />
    </div>
  )
}

export default AuctionSlotsPage
