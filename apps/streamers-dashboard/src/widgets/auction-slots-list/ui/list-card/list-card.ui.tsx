import { RefObject, forwardRef, memo } from 'react'

import NumberFlow from '@number-flow/react'

import { ResponsiveEditSlotDialogue } from '~widgets/edit-slot-dialogs/responsive-dialog/ui'

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
          className="flex flex-col justify-between border-1 border-dark gap-y-2 tablet:gap-y-3 py-1 tablet:py-2"
        >
          <CardHeader className="flex items-start justify-between h-6">
            <CardTitle className="w-full">
              <Typography
                tag="span"
                className="text-md tablet:text-title font-semibold font-golos-f"
              >
                {slot.name}
              </Typography>
            </CardTitle>
            <Flex className="gap-x-1 h-6" direction="row">
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
            </Flex>
          </CardHeader>
          <CardContent className="w-full flex flex-col gap-y-2 pt-0">
            <Flex
              className="w-full gap-x-1.25 tablet:gap-x-2"
              direction="row"
              align="center"
            >
              <div
                className="h-6 w-7 tablet:w-8 tablet:h-7 rounded-md"
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
