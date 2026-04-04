import { memo, useEffect, useMemo, useRef, useState } from 'react'

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

import { SlotPointsInput } from '../inputs/slot-points-input.ui'
import { SlotTitleInput } from '../inputs/slot-title-input.ui'

export type LocalAuctionSlotListCardProps = Omit<CardProps, 'slot' | 'onFocus' | 'onBlur'> & {
  slotId: number
  isWinner?: boolean
} & UseCardFocusOptions

export const LocalAuctionSlotListCard = memo((props: LocalAuctionSlotListCardProps) => {
  const { slotId, isWinner = false, onFocus, onBlur, ...restProps } = props

  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const { updateSlot } = useActionCreators(auctionSlotsActions)

  const slot = useMemo<AuctionSlot>(() => auctionSlots.find(slot => slot.id === slotId)!, [auctionSlots, slotId])

  const [titleInputValue, setTitleInputValue] = useState(slot.title)
  const [pointsInputValue, setPointsInputValue] = useState<Maybe<number>>(slot.points)
  const [addedPointsValue, setAddedPointsValue] = useState<string>('')

  const { ref } = useCardFocus({ onFocus, onBlur })

  useEffect(() => {
    const isDifferentSlotValues = titleInputValue !== slot.title || pointsInputValue !== slot.points

    if (isDifferentSlotValues) {
      updateSlot({ id: slot.id, data: { title: titleInputValue, points: pointsInputValue } })
    }
  }, [
    titleInputValue,
    pointsInputValue,
    slot.title,
    slot.points,
    slot.id,
    updateSlot,
  ])

  const handleTitleChange = (value: string) => {
    setTitleInputValue(value)
  }

  const handlePointsChange = (value: Maybe<number>) => {
    setPointsInputValue(value)
  }

  const handleAddPointsButtonOnClick = () => {
    if (addedPointsValue.length !== 0) {
      const addedNum = Number(deleteAllSpacesFromString(addedPointsValue))

      setPointsInputValue(curr => (curr ?? 0) + addedNum)
      setAddedPointsValue('')
    }
  }

  return (
    <Card ref={ref} className="w-full px-3 py-2 rounded-medium" {...restProps}>
      <div className="flex items-center gap-x-2 w-full">

        <div className="shrink-0">
          <AuctionSlotCardStatusInfo
            isDropped={slot.isDropped}
            isWinner={isWinner}
          />
        </div>

        <div className="flex flex-1 min-w-0 gap-x-2">

          <SlotTitleInput
            value={titleInputValue}
            onInput={handleTitleChange}
          />

          <div className="flex items-center gap-x-2">

            <div className="flex items-center gap-x-1 flex-1 min-w-0">

              <div className="flex-1 min-w-[150px]">
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

              <div className="flex-1 min-w-[120px]">
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
                }}
                winPercents={Number(slot.winPercents.toFixed(2))}
              />

              <Button
                className="hover:bg-dark-light"
                variant="ghost"
                isIconOnly
                icon={<Icons.Dots className="rotate-90" />}
              />
            </div>

          </div>
        </div>
      </div>
    </Card>
  )
})

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

  // const debouncedUnfocus = useDebounceCallback((isFocused: boolean) => {
  // if (isFocused !== isActiveElementInside) {
  //   setIsActiveElementInside(isFocused)

  //   if (isFocused) {
  //     optionsRef.current?.onFocus?.()
  //   }
  //   else {
  //     optionsRef.current?.onBlur?.()
  //   }
  // }
  // }, 5)

  // useEffect(() => {
  //   const isActiveElementInsideCard = ref.current?.contains(activeElement) ||

  //   if (isActiveElementInsideCard !== isActiveElementInside) {
  //     debouncedUnfocus(isActiveElementInsideCard)
  //   }
  //   else {
  //     debouncedUnfocus.cancel()
  //   }
  // }, [activeElement, isActiveElementInside, debouncedUnfocus, ref.state])

  // useUnmount(() => {
  //   debouncedUnfocus.cancel()
  // })

  return { ref, isFocused: isActiveElementInside }
}
