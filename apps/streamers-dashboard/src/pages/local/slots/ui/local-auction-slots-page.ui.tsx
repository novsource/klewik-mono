import type { ChangeEvent } from 'react'
import { useState } from 'react'

import type { OnValueChange } from 'react-number-format'

import { ExportSlotsPopover } from '~features/auction-slot/export-slots/ui'

import { auctionSlotsActions, auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from 'klewik-ui/button'
import { Divider } from 'klewik-ui/divider'
import { Icons } from 'klewik-ui/icons'
import { Input } from 'klewik-ui/input'
import { NumberInput } from 'klewik-ui/number-input'
import { toastSuccessNotification } from 'klewik-ui/toaster'

import { LocalAuctionSlotsList } from './lists/local-auction-slots-list.ui'
import { LocalDonationsList } from './lists/local-donations-list.ui'

export const LocalAuctionSlotsPage = () => {
  return (
    <div className="w-full h-full tablet:min-h-[var(--height-page)] tablet:h-auto">
      <div className="flex w-full h-full pt-6 px-6 gap-x-6 items-center">
        <div className="flex flex-col w-full h-full gap-y-4 px-2">

          <div className="flex w-full gap-x-2">
            <ExportSlotsPopover className="w-fit" size="sm" />
          </div>

          <AddSlotPanel />
          <LocalAuctionSlotsList />
        </div>

        <Divider className="h-1/5" orientation="vertical" />

        <div className="flex w-full h-full basis-1/4">
          <LocalDonationsList />
        </div>
      </div>
    </div>
  )
}

function AddSlotPanel() {
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const { addSlots } = useActionCreators(auctionSlotsActions)

  const [title, setTitle] = useState('')
  const [points, setPoints] = useState(0)

  const handleOnTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleOnPointsValueChange: OnValueChange = (values) => {
    const { floatValue } = values

    if (floatValue)
      setPoints(floatValue)
  }

  const handleOnClick = () => {
    const lastSlot = auctionSlots.at(-1)

    addSlots([{
      id: lastSlot ? lastSlot.id + 1 : 1,
      auctionSlotOrder: lastSlot ? lastSlot.auctionSlotOrder + 1 : 1,
      isAlived: true,
      isDropped: false,
      points,
      title,
    }])

    setTitle('')
    setPoints(0)

    toastSuccessNotification('Слот успешно добавлен!')
  }

  return (
    <div className="flex gap-x-2">
      <Input
        value={title}
        placeholder="Название слота"
        slotClassNames={{ base: 'w-full' }}
        onChange={handleOnTitleChange}
      />
      <NumberInput
        value={points}
        placeholder="Очки"
        startContent={<Icons.Coin className="text-gray-light" />}
        thousandSeparator=" "
        decimalScale={0}
        allowNegative={false}
        onValueChange={handleOnPointsValueChange}
      />

      <Button variant="action" startContent={<Icons.Plus />} onClick={handleOnClick}>Добавить</Button>
    </div>
  )
}
