import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions } from '~entities/auction-slot/store'
import { AuctionSlotCardStatusInfo, AuctionSlotCardWinPercents } from '~entities/auction-slot/ui/card'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import { Button } from 'klewik-ui/button'
import { Card } from 'klewik-ui/card'
import { Icons } from 'klewik-ui/icons'
import { Input } from 'klewik-ui/input'
import { NumberInput } from 'klewik-ui/number-input'

export type LocalAuctionSlotListCardProps = {
  slot: AuctionSlot
  isWinner?: boolean
}

export const LocalAuctionSlotListCard = (props: LocalAuctionSlotListCardProps) => {
  const { slot, isWinner = false } = props

  const { updateSlot } = useActionCreators(auctionSlotsActions)

  return (
    <Card className="w-full flex px-3 py-2 rounded-medium">
      <div className="w-full flex items-center justify-between gap-x-4">

        <div className="w-full flex gap-x-2 items-center">
          <AuctionSlotCardStatusInfo isDropped={slot.isDropped} isWinner={isWinner} />

          <Input
            variant="ghost"
            slotClassNames={{ base: 'w-full', input: 'text-base font-semibold' }}
            defaultValue={slot.title}
            value={slot.title}
            onInput={(event) => {
              updateSlot({ id: slot.id, data: { title: event.data } })
            }}
          />
        </div>

        <div className="flex gap-x-6 items-center">
          <div className="flex items-center gap-x-4">
            <NumberInput
              variant="ghost"
              defaultValue={slot.points}
              slotClassNames={{ base: 'text-gray-light' }}
              startContent={<Icons.Coin />}
              onInput={(event) => {
                updateSlot({ id: slot.id, data: { points: Number(event.data) } })
              }}
            />
            <AuctionSlotCardWinPercents winPercents={slot.winPercents} />
          </div>

          <Button variant="ghost" isIconOnly icon={<Icons.Dots className="rotate-90" />} />
        </div>
      </div>
    </Card>
  )
}
