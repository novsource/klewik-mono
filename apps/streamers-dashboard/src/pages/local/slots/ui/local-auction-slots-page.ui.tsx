import type { ChangeEvent } from 'react'
import { useRef, useState } from 'react'

import type { OnValueChange } from 'react-number-format'

import { useAuctionSlotsIDB } from '~entities/auction-slot/hooks'
import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions, auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useKeyboard } from '~shared/hooks'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from 'klewik-ui/button'
import { Divider } from 'klewik-ui/divider'
import { Icons } from 'klewik-ui/icons'
import { Input } from 'klewik-ui/input'
import { NumberInput } from 'klewik-ui/number-input'
import { toastErrorNotification, toastSuccessNotification } from 'klewik-ui/toaster'

import { getPercentValue } from '~shared/utils/common'
import { isStringEmpty } from '~shared/utils/validation/is-string-empty'

import { LocalAuctionSlotsList } from './lists/local-auction-slots-list.ui'
import { LocalDonationsList } from './lists/local-donations-list.ui'

export const LocalAuctionSlotsPage = () => {
  return (
    <div className="w-full h-full tablet:min-h-[var(--height-page)] tablet:h-auto">
      <div className="flex w-full h-full pt-8 pl-6 gap-x-6 items-center">
        <div className="flex flex-col w-full h-full gap-y-4 px-2 basis-3/4">
          <div className="w-full flex gap-x-2 items-center">
            <Input
              slotClassNames={{ base: 'min-w-[280px]', input: 'text-title overflow-ellipsis text-nowrap overflow-hidden' }}
              placeholder="Поиск по названию..."
              startContent={<Icons.Magnifier className="text-gray-light" />}
              size="lg"
            />
            <Divider className="mx-2" orientation="vertical" />
            <AddSlotPanel />
          </div>

          {/* <div className="flex w-full gap-x-2">
             <ImportSlotsPopover cl/>
             <ExportSlotsPopover className="w-fit" size="sm" />
          </div> */}

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
  const pointsSum = useStoreSelector(auctionSlotsSelectors.getSlotsPointsSum)

  const { addSlots } = useActionCreators(auctionSlotsActions)

  const auctionSlotsIDB = useAuctionSlotsIDB()

  const [titleInputValue, setTitleInputValue] = useState('')
  const [pointsInputValue, setPointsInputValue] = useState('')

  const containerRef = useRef<HTMLDivElement>(null)

  const addSlot = async () => {
    const pointsInNum = Number(pointsInputValue)

    if (isStringEmpty(titleInputValue) || Number.isNaN(pointsInNum) || pointsInNum < 0)
      return

    const lastSlot = auctionSlots.at(-1)

    try {
      const newSlot: AuctionSlot = {
        id: lastSlot ? lastSlot.id + 1 : 1,
        auctionSlotOrder: lastSlot ? lastSlot.auctionSlotOrder + 1 : 1,
        isAlived: true,
        isDropped: false,
        points: pointsInNum,
        title: titleInputValue,
        winPercents: getPercentValue(pointsSum, pointsInNum) * 100,
      }

      // await auctionSlotsIDB.add(newSlot)

      addSlots([newSlot])

      setTitleInputValue('')
      setPointsInputValue('')
    }
    catch {
      toastErrorNotification('Не удалось создать слот', 'Ошибка сохранения')
    }
  }

  useKeyboard(containerRef, {
    onKeyUp: (event) => {
      const key = event.key.toLowerCase()

      if (key === 'enter') {
        addSlot()
      }
    },
  })

  const handleOnTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitleInputValue(event.target.value)
  }

  const handleOnPointsValueChange: OnValueChange = (values) => {
    const { value } = values

    setPointsInputValue(value)
  }

  const handleOnClick = () => {
    addSlot()
    toastSuccessNotification('Слот успешно добавлен!')
  }

  const isAddButtonDisabled = isStringEmpty(titleInputValue) || Number(pointsInputValue) < 0

  return (
    <div ref={containerRef} className="w-full flex gap-x-2">
      <Input
        value={titleInputValue}
        placeholder="Название слота"
        slotClassNames={{ base: 'w-full', wrapper: 'px-4', input: 'text-title overflow-ellipsis text-nowrap overflow-hidden' }}
        size="lg"
        onChange={handleOnTitleChange}
      />
      <NumberInput
        value={pointsInputValue}
        placeholder="Очки"
        startContent={<Icons.Coin className="text-gray-light" />}
        thousandSeparator=" "
        size="lg"
        slotClassNames={{ input: 'text-title font-golos-f' }}
        decimalScale={0}
        valueIsNumericString
        allowNegative={false}
        onValueChange={handleOnPointsValueChange}
      />

      <Button
        variant="action"
        startContent={<Icons.Plus />}
        disabled={isAddButtonDisabled}
        onClick={handleOnClick}
      >
        Добавить
      </Button>
    </div>
  )
}
