import type { ChangeEvent } from 'react'
import { useRef, useState } from 'react'

import type { OnValueChange } from 'react-number-format'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions, auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useKeyboard } from '~shared/hooks'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from 'klewik-ui/button'
import { Icons } from 'klewik-ui/icons'
import { Input } from 'klewik-ui/input'
import { NumberInput } from 'klewik-ui/number-input'
import { toastSuccessNotification } from 'klewik-ui/toaster'
import { isStringEmpty } from 'klewik-ui/utils'

import { getPercentValue } from '~shared/utils/common'

export const AddSlotPanel = () => {
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const pointsSum = useStoreSelector(auctionSlotsSelectors.getSlotsPointsSum)

  const { addSlots } = useActionCreators(auctionSlotsActions)

  const [titleInputValue, setTitleInputValue] = useState('')
  const [pointsInputValue, setPointsInputValue] = useState('')

  const containerRef = useRef<HTMLDivElement>(null)

  const clearInputs = () => {
    setTitleInputValue('')
    setPointsInputValue('')
  }

  const addSlot = () => {
    const pointsInNum = Number(pointsInputValue)
    if (isStringEmpty(titleInputValue) || Number.isNaN(pointsInNum) || pointsInNum < 0)
      return

    const lastSlot = auctionSlots.at(-1)

    const newSlot: AuctionSlot = {
      id: lastSlot ? lastSlot.id + 1 : 1,
      auctionSlotOrder: lastSlot ? lastSlot.auctionSlotOrder + 1 : 1,
      isAlived: true,
      isDropped: false,
      points: pointsInNum,
      title: titleInputValue,
      winPercents: getPercentValue(pointsSum, pointsInNum) * 100,
    }

    addSlots([newSlot])
    clearInputs()
  }

  useKeyboard(containerRef, {
    onKeyUp: (event) => {
      const key = event.key.toLowerCase()

      if (key === 'enter') {
        addSlot()
        toastSuccessNotification('Слот успешно добавлен!')
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
