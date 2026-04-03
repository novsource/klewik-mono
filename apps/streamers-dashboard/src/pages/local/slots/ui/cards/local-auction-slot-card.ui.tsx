import { useState } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions } from '~entities/auction-slot/store'
import { AuctionSlotCardStatusInfo, AuctionSlotCardWinPercents } from '~entities/auction-slot/ui/card'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import { Button } from 'klewik-ui/button'
import { Card } from 'klewik-ui/card'
import { Icons } from 'klewik-ui/icons'

import { SlotPointsInput } from '../inputs/slot-points-input.ui'
import { SlotTitleInput } from '../inputs/slot-title-input.ui'

export type LocalAuctionSlotListCardProps = {
  slot: AuctionSlot
  isWinner?: boolean
}

export const LocalAuctionSlotListCard = (props: LocalAuctionSlotListCardProps) => {
  const { slot, isWinner = false } = props

  const { updateSlot } = useActionCreators(auctionSlotsActions)

  const [addedPointsValue, setAddedPointsValue] = useState(0)

  const handleTitleChange = (value: string) => {
    updateSlot({ id: slot.id, data: { title: value } })
  }

  const handlePointsChange = (value: Maybe<number>) => {
    if (value) {
      updateSlot({ id: slot.id, data: { points: value } })
    }
  }

  return (
    <Card className="w-full px-3 py-2 rounded-medium">
      <div className="flex items-center gap-x-2 w-full">

        <div className="shrink-0">
          <AuctionSlotCardStatusInfo
            isDropped={slot.isDropped}
            isWinner={isWinner}
          />
        </div>

        <div className="flex flex-1 min-w-0 gap-y-2">

          <SlotTitleInput
            value={slot.title}
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
              />

              <div className="flex-1 min-w-[120px]">
                <SlotPointsInput
                  value={addedPointsValue}
                  onInput={setAddedPointsValue}
                />
              </div>
            </div>

            {/* ПРОЦЕНТЫ + МЕНЮ */}
            <div className="flex items-center gap-x-3 flex-none shrink-0">

              <AuctionSlotCardWinPercents
                numberFlowProps={{
                  className: 'w-[5ch] text-right tabular-nums shrink-0',
                }}
                winPercents={slot.winPercents}
              />

              <Button
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

  // return (
  //   <Card className="w-full px-3 py-2 rounded-medium">
  //     <div className="w-full gap-x-2 local-slot-card_wrapper">
  //       <AuctionSlotCardStatusInfo isDropped={slot.isDropped} isWinner={isWinner} />

  //       <div className="w-full flex gap-x-2">
  //         <div className="flex gap-x-1 items-center min-w-0 flex-1">
  //           <SlotTitleInput value={slot.title} onInput={handleTitleChange} />

  //           <div className="flex-1 min-w-0">
  //             <SlotPointsInput slotClassNames={{ base: 'w-full' }} value={slot.points} onInput={handlePointsChange} />
  //           </div>
  //           <div className="shrink-0">
  //             <Button variant="borderless" isIconOnly icon={<Icons.Plus />} />
  //           </div>
  //           <div className="flex-1 min-w-0">
  //             <SlotPointsInput slotClassNames={{ base: 'w-full' }} value={addedPointsValue} onInput={setAddedPointsValue} />
  //           </div>
  //         </div>

  //         <div className="flex justify-between items-center gap-x-4 flex-none">
  //           <AuctionSlotCardWinPercents
  //             numberFlowProps={{
  //               className: 'w-[4ch] text-right tabular-nums',
  //             }}
  //             winPercents={slot.winPercents}
  //           />

  //           <Button variant="ghost" isIconOnly icon={<Icons.Dots className="rotate-90" />} />
  //         </div>
  //       </div>
  //     </div>
  //   </Card>
  // )
}

// type SlotTitleInputProps = {
//   slot: AuctionSlot
// }

// const SlotTitleInput = memo((props: SlotTitleInputProps) => {
//   const { slot } = props

//   const { updateSlot } = useActionCreators(auctionSlotsActions)

//   const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
//     updateSlot({ id: slot.id, data: { title: event.target.value } })
//   }

//   return (
//     <Input
//       variant="ghost"
//       slotClassNames={{ base: 'w-full', wrapper: 'px-2', input: 'text-base font-semibold text-title' }}
//       value={slot.title}
//       size="lg"
//       onChange={handleOnChange}
//     />
//   )
// })

// type SlotPointsInputProps = {
//   slot: AuctionSlot
// }

// function SlotPointsInput(props: SlotPointsInputProps) {
//   const { slot } = props

//   const [value, setValue] = useState(0)

//   const { updateSlot } = useActionCreators(auctionSlotsActions)

//   const handleOnValueChange: OnValueChange = (values) => {
//     const { floatValue } = values

//     if (floatValue)
//       // setValue(floatValue)
//       updateSlot({ id: slot.id, data: { points: floatValue } })
//   }

//   return (
//     <NumberInput
//       variant="ghost"
//       value={slot.points}
//       slotClassNames={{ input: 'font-golos-f text-title' }}
//       startContent={<Icons.Coin className="text-gray-light" />}
//       thousandSeparator=" "
//       decimalScale={0}
//       allowNegative={false}
//       onFocus={console.log}
//       onValueChange={handleOnValueChange}
//     />
//   )
// }
