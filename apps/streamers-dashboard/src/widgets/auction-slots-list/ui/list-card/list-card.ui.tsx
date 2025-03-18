import { RefObject, forwardRef, memo } from 'react'

import { ResponsiveEditSlotDialogue } from '~widgets/edit-slot-dialogs/responsive-dialog/ui/'

import { DeleteSlotButton } from '~features/auction-slot/delete-slot/ui'
import { AuctionCardChip } from '~features/auction-slot/watch-slots/ui'

import { Auction } from '~entities/auction/model'

import { AuctionSlot } from '~entities/auction-slot/model'

import { Button } from '~shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~shared/ui/card'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

type AuctionSlotCardWithControlsProps = AuctionSlot & {
  auctionId: Auction['id']
  percent: string | number
  ref?: RefObject<HTMLDivElement>
}

const AuctionSlotCardWithControls = memo(
  forwardRef<HTMLDivElement, AuctionSlotCardWithControlsProps>(
    (props, forwardRef) => {
      const { percent, auctionId, ...slot } = props

      return (
        <Card
          ref={forwardRef}
          className="flex flex-col justify-between border-1 border-dark gap-y-3 py-2"
        >
          <CardHeader className="flex items-start justify-between h-6">
            <CardTitle className="w-full">
              <Typography
                tag="span"
                className="font-golos-f text-title font-semibold"
              >
                {slot.name}
              </Typography>
            </CardTitle>
            <div className="flex flex-row gap-x-1 h-6">
              <ResponsiveEditSlotDialogue
                slot={slot}
                trigger={
                  <Button
                    variant={'ghost'}
                    isIconOnly
                    icon={<Icons.Pencil size="xs" />}
                    className="text-gray-accent transition-colors hover:text-white h-full px-1 py-1"
                    size={'sm'}
                  >
                    Изменить
                  </Button>
                }
                isFullPageHeight
              />
              <DeleteSlotButton
                icon={<Icons.Bin size="xs" />}
                auctionId={auctionId}
                slotId={slot.id}
              />
            </div>
          </CardHeader>
          <CardContent className="w-full flex flex-col gap-y-2 pt-0">
            <div className="w-full flex flex-row gap-x-2 items-center">
              <div
                className="w-8 h-7 rounded-md"
                style={{
                  backgroundColor: Array.isArray(slot.color)
                    ? `rgb(${slot.color.join(',')})`
                    : slot.color,
                }}
              />
              <AuctionCardChip
                startContent={
                  <Icons.Id className="text-gray-light" size="sm" />
                }
              >
                {slot.id}
              </AuctionCardChip>
              <AuctionCardChip
                startContent={
                  <Icons.Coin className="text-gray-light" size="sm" />
                }
              >
                {Intl.NumberFormat('ru-Ru').format(slot.points).toString()}
              </AuctionCardChip>
              <AuctionCardChip
                classNames={{ base: 'bg-green/20', text: 'text-green' }}
              >
                {percent}%
              </AuctionCardChip>
            </div>
          </CardContent>
        </Card>
      )
    }
  )
)

export { AuctionSlotCardWithControls }
