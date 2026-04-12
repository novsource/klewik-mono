import type { UseListCardFocusOptions } from '../../hooks/use-list-card-focus'

import { memo, useState } from 'react'

import { auctionSelectors } from '~entities/auction/store'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions, auctionSlotsSelectors } from '~entities/auction-slot/store'
import { AuctionSlotCardStatusInfo, AuctionSlotCardWinPercents } from '~entities/auction-slot/ui/card'

import { useDebounceCallback, usePrevious } from '~shared/hooks'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from 'klewik-ui/button'
import type { CardProps } from 'klewik-ui/card'
import { Card } from 'klewik-ui/card'
import { Group } from 'klewik-ui/group'
import { Icons } from 'klewik-ui/icons'

import { deleteAllSpacesFromString } from '~shared/utils'
import { cn } from '~shared/utils/react'

import { useListCardFocus } from '../../hooks/use-list-card-focus'
import { DeleteSlotButton } from '../delete-slots-buttons/delete-slot-button.ui'
import { SlotPointsInput } from './slot-points-input.ui'
import { SlotTitleInput } from './slot-title-input.ui'

export type AuctionSlotListCardProps = Omit<CardProps, 'slot' | 'onFocus' | 'onBlur'> & {
  slotId: number
  isWinner?: boolean
} & UseListCardFocusOptions

export const AuctionSlotListCard = memo((props: AuctionSlotListCardProps) => {
  const { slotId, className, onFocus, onBlur, ...restProps } = props

  const { updateSlot } = useActionCreators(auctionSlotsActions)

  const winnerId = useStoreSelector(auctionSelectors.getWinnerId)
  const storedSlot = useStoreSelector(state => auctionSlotsSelectors.getSlotById(state, slotId))

  const previousSlot = usePrevious(storedSlot)

  const { ref } = useListCardFocus({ onFocus, onBlur })

  const isWinner = slotId === winnerId

  // useActiveElement throw error when ref changes to undefined
  if (!storedSlot && !previousSlot) {
    return <div ref={ref} className="hidden" />
  }

  const slot = storedSlot ?? previousSlot

  return (
    <Card ref={ref} className={cn('w-full px-2.75 py-1.5 rounded-medium', className)} {...restProps}>
      <Group className="w-full" gap="sm">

        <div className="shrink-0">
          <AuctionSlotCardStatusInfo
            slotClassnames={{
              wrapper: cn('cursor-pointer', slot?.isDropped && 'hover:bg-dark-accent', slot?.isAlived && 'hover:bg-red/20'),
            }}
            isDropped={slot!.isDropped}
            isWinner={isWinner}
            onClick={() => {
              if (!slot)
                return

              updateSlot({ id: slot.id, data: { isAlived: !slot.isAlived, isDropped: !slot.isDropped } })
            }}
          />
        </div>

        <SlotCardControls slot={slot!} />
      </Group>
    </Card>
  )
})

type MemoizedTitleInputProps = {
  slotId: number
  value: string
}

const MemoizedTitleInput = memo((props: MemoizedTitleInputProps) => {
  const { value, slotId } = props

  const { updateSlot } = useActionCreators(auctionSlotsActions)

  const [titleInputValue, setTitleInputValue] = useState(value)

  const updateSlotTitleDebounced = useDebounceCallback((title: string) => {
    updateSlot({ id: slotId, data: { title } })
  }, 250)

  const handleTitleOnInput = (value: string) => {
    setTitleInputValue(value)
    updateSlotTitleDebounced(value)
  }

  return (
    <SlotTitleInput
      value={titleInputValue}
      onInput={handleTitleOnInput}
    />
  )
})

type MemoizedPointsInputProps = {
  slotId: number
  value: number
}

const MemoizedPointsInput = memo((props: MemoizedPointsInputProps) => {
  const { value, slotId } = props

  const [isFocused, setIsFocused] = useState(false)

  const { updateSlot } = useActionCreators(auctionSlotsActions)

  const [pointsInputValue, setPointsInputValue] = useState<Maybe<number>>(value)

  const updateSlotTitleDebounced = useDebounceCallback((points: number) => {
    updateSlot({ id: slotId, data: { points } })
  }, 200)

  const handlePointsOnInput = (value: Maybe<number>) => {
    setPointsInputValue(value)
    updateSlotTitleDebounced(value ?? 0)
  }

  return (
    <SlotPointsInput
      value={isFocused ? pointsInputValue : value}
      onInput={handlePointsOnInput}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  )
})

type SlotCardControlsProps = {
  slot: AuctionSlot
}

function SlotCardControls(props: SlotCardControlsProps) {
  const { slot } = props

  const { updateSlot } = useActionCreators(auctionSlotsActions)

  const [addedPointsValue, setAddedPointsValue] = useState<string>('')

  const handleAddPointsButtonOnClick = () => {
    if (addedPointsValue.length === 0)
      return

    const addedNum = Number(deleteAllSpacesFromString(addedPointsValue))

    updateSlot({ id: slot.id, data: { points: slot.points + addedNum } })
    setAddedPointsValue('')
  }

  return (
    <div className="flex flex-1 min-w-0 gap-x-2">

      <MemoizedTitleInput
        slotId={slot.id}
        value={slot.title}
      />

      <Group gap="sm">
        <Group className="flex-1 min-w-0" gap="xs">
          <div className="flex-1 min-w-[115px] tablet:min-w-[135px]">
            <MemoizedPointsInput
              slotId={slot.id}
              value={slot.points}
            />
          </div>

          <Button
            variant="borderless"
            isIconOnly
            icon={<Icons.Plus />}
            className="shrink-0"
            onClick={handleAddPointsButtonOnClick}
          />

          <div className="flex-1 min-w-[100px] tablet:min-w-[120px]">
            <SlotPointsInput
              value={addedPointsValue}
              placeholder="Добавить очки"
              valueIsNumericString
              onValueChange={values => setAddedPointsValue(values.formattedValue)}
            />
          </div>
        </Group>

        <Group className="gap-x-3 flex-none shrink-0">
          <AuctionSlotCardWinPercents
            numberFlowProps={{
              className: 'w-[6ch] text-right tabular-nums shrink-0 overflow-clip',
              animated: false,
            }}
            winPercents={Number.isNaN(Number(slot.winPercents)) ? 0 : Number(slot.winPercents.toFixed(2))}
          />

          <DeleteSlotButton slotId={slot.id} />
        </Group>
      </Group>
    </div>
  )
}
