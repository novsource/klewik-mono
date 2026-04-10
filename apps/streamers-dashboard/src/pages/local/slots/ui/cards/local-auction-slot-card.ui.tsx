import { memo, useEffect, useRef, useState } from 'react'

import { auctionSelectors } from '~entities/auction/store'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions, auctionSlotsSelectors } from '~entities/auction-slot/store'
import { AuctionSlotCardStatusInfo, AuctionSlotCardWinPercents } from '~entities/auction-slot/ui/card'

import { useActiveElement, usePrevious } from '~shared/hooks'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from 'klewik-ui/button'
import type { CardProps } from 'klewik-ui/card'
import { Card } from 'klewik-ui/card'
import { Icons } from 'klewik-ui/icons'

import { deleteAllSpacesFromString } from '~shared/utils'
import { cn } from '~shared/utils/react'

import { DeleteLocalSlotButton } from '../buttons/delete-local-slot-button.ui'
import { SlotPointsInput } from '../inputs/slot-points-input.ui'
import { SlotTitleInput } from '../inputs/slot-title-input.ui'

export type LocalAuctionSlotListCardProps = Omit<CardProps, 'slot' | 'onFocus' | 'onBlur'> & {
  slotId: number
  isWinner?: boolean
} & UseCardFocusOptions

export const LocalAuctionSlotListCard = memo((props: LocalAuctionSlotListCardProps) => {
  const { slotId, className, onFocus, onBlur, ...restProps } = props

  const winnerId = useStoreSelector(auctionSelectors.getWinnerId)
  const slot = useStoreSelector(state => auctionSlotsSelectors.getSlotById(state, slotId))

  const { ref } = useCardFocus({ onFocus, onBlur })

  const isWinner = slotId === winnerId

  // useActiveElement throw error when ref changes to undefined
  if (!slot)
    return <div ref={ref} className="hidden" />

  return (
    <Card ref={ref} className={cn('w-full px-2.75 py-1.5 rounded-medium', className)} {...restProps}>
      <div className="flex items-center gap-x-2 w-full">

        <div className="shrink-0">
          <AuctionSlotCardStatusInfo
            isDropped={slot.isDropped}
            isWinner={isWinner}
          />
        </div>

        <SlotCardControls slot={slot} />
      </div>
    </Card>
  )
})

type SlotCardControlsProps = {
  slot: AuctionSlot
}

function SlotCardControls(props: SlotCardControlsProps) {
  const { slot } = props

  const { updateSlot } = useActionCreators(auctionSlotsActions)

  const [addedPointsValue, setAddedPointsValue] = useState<string>('')

  const handleTitleChange = (value: string) => {
    updateSlot({ id: slot.id, data: { title: value } })
  }

  const handlePointsChange = (value: Maybe<number>) => {
    updateSlot({ id: slot.id, data: { points: value } })
  }

  const handleAddPointsButtonOnClick = () => {
    if (addedPointsValue.length === 0)
      return

    const addedNum = Number(deleteAllSpacesFromString(addedPointsValue))

    updateSlot({ id: slot.id, data: { points: slot.points + addedNum } })
    setAddedPointsValue('')
  }

  return (
    <div className="flex flex-1 min-w-0 gap-x-2">

      <SlotTitleInput
        value={slot.title}
        onInput={handleTitleChange}
      />

      <div className="flex items-center gap-x-2">

        <div className="flex items-center gap-x-1 flex-1 min-w-0">

          <div className="flex-1 min-w-[115px] tablet:min-w-[135px]">
            <SlotPointsInput
              value={slot.points}
              onInput={handlePointsChange}
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
        </div>

        <div className="flex items-center gap-x-3 flex-none shrink-0">

          <AuctionSlotCardWinPercents
            numberFlowProps={{
              className: 'w-[6ch] text-right tabular-nums shrink-0 overflow-clip',
              animated: false,
            }}
            winPercents={Number.isNaN(Number(slot.winPercents)) ? 0 : Number(slot.winPercents.toFixed(2))}
          />

          <DeleteLocalSlotButton slotId={slot.id} />
        </div>

      </div>
    </div>
  )
}

type UseCardFocusOptions = {
  onFocus?: () => void
  onBlur?: () => void
}

function useCardFocus(options?: UseCardFocusOptions) {
  const optionsRef = useRef(options)
  optionsRef.current = options

  const { ref, value: activeElement } = useActiveElement<HTMLDivElement>()

  const [isActiveElementInside, setIsActiveElementInside] = useState(() => (ref.current?.contains(activeElement) || ref.current === activeElement) ?? false)

  const previousWasActive = usePrevious(isActiveElementInside)

  useEffect(() => {
    const isFocused = ref.current?.contains(activeElement) || ref.current === activeElement

    if (isFocused !== isActiveElementInside) {
      setIsActiveElementInside(isFocused)

      if (isFocused) {
        optionsRef.current?.onFocus?.()
      }
      else {
        optionsRef.current?.onBlur?.()
      }
    }
  }, [previousWasActive, isActiveElementInside, activeElement, ref.state])

  return { ref, isFocused: isActiveElementInside }
}
