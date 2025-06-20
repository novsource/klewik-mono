import { RefObject, forwardRef, memo } from 'react'

import NumberFlow from '@number-flow/react'

import { ResponsiveEditSlotDialogue } from '~widgets/edit-slot-dialog/ui'

import { DeleteSlotButton } from '~features/auction-slot/delete-slot/ui'

import { Auction } from '~entities/auction/model'

import { AuctionSlot } from '~entities/auction-slot/model'
import { AuctionCardChip } from '~entities/auction-slot/ui/card'

import { Button } from '~shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~shared/ui/card'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

type AuctionSlotCardWithControlsProps = AuctionSlot & {
  auctionId: Auction['id']
  percent: number
  ref?: RefObject<HTMLDivElement>
}

const AuctionSlotCardWithControls = memo(
  forwardRef<HTMLDivElement, AuctionSlotCardWithControlsProps>(
    (props, forwardRef) => {
      const { percent, auctionId, ...slot } = props

      return (
        <Card
          ref={forwardRef}
          className="flex flex-col justify-between gap-y-2 border-1 border-dark py-1 tablet:gap-y-3 tablet:py-2"
        >
          <CardHeader className="flex h-6 items-start justify-between">
            <CardTitle className="w-full">
              <Typography
                tag="span"
                className="font-golos-f text-md font-semibold tablet:text-title"
              >
                {slot.name}
              </Typography>
            </CardTitle>
            <Flex className="h-6 gap-x-1" direction="row">
              <ResponsiveEditSlotDialogue
                slot={slot}
                trigger={
                  <Button
                    variant={'ghost'}
                    isIconOnly
                    icon={<Icons.Pencil size="xs" />}
                    className="h-full px-1 py-1 text-gray-accent transition-colors hover:text-white"
                    size={'sm'}
                  >
                    Изменить
                  </Button>
                }
              />
              <DeleteSlotButton
                icon={<Icons.Bin size="xs" />}
                auctionId={auctionId}
                slotId={slot.id}
              />
            </Flex>
          </CardHeader>
          <CardContent className="flex w-full flex-col gap-y-2 pt-0">
            <Flex
              className="w-full gap-x-1.25 tablet:gap-x-2"
              direction="row"
              align="center"
            >
              <div
                className="h-6 w-7 rounded-md tablet:h-7 tablet:w-8"
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
                <NumberFlow
                  className="font-golos-f font-medium"
                  willChange
                  trend={0}
                  value={slot.points}
                  locales={'ru-RU'}
                />
              </AuctionCardChip>
              <AuctionCardChip
                classNames={{ base: 'bg-green/20', text: 'text-green' }}
              >
                <NumberFlow
                  willChange
                  trend={0}
                  value={percent}
                  format={{
                    notation: 'compact',
                    compactDisplay: 'short',
                  }}
                  locales={'ru-RU'}
                />
                %
              </AuctionCardChip>
            </Flex>
          </CardContent>
        </Card>
      )
    }
  )
)

export { AuctionSlotCardWithControls }
