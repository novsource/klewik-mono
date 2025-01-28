import { ComponentProps, memo } from 'react'

import { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { AnimatedTruncText } from '~shared/ui/animated-trunc-text'
import { Button } from '~shared/ui/button'
import { Card, CardContent } from '~shared/ui/card'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

const AuctionSlotCard = memo((props: AuctionSlot) => {
  const { id, name, points } = props
  return (
    <Card className="flex flex-row justify-between">
      <CardContent className="flex flex-col gap-y-2 pt-0">
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-row gap-x-2 items-center">
            <Typography className="text-gray-light text-nowrap" tag="p">
              Название слота:
            </Typography>
            <AnimatedTruncText classNames="font-golos-f">
              {name}
            </AnimatedTruncText>
          </div>
          <div className="flex flex-row gap-x-2 items-center">
            <Typography className="text-gray-light" tag="span">
              Количество очков:
            </Typography>
            <Typography className="font-golos-f" tag="span">
              {Intl.NumberFormat('ru-Ru').format(points).toString()}
            </Typography>
          </div>
          <div className="flex flex-row gap-x-2 items-center">
            <Typography className="text-gray-light" tag="span">
              Шанс:
            </Typography>
            <Typography className="font-golos-f" tag="span">
              10%
            </Typography>
          </div>
        </div>

        <div className="flex flex-row gap-x-2 items-center">
          <Icons.Id className="text-gray-light" />
          <Typography className="font-golos-f" tag="span">
            {id}
          </Typography>
        </div>
      </CardContent>
      <CardContent className="flex h-full pt-0">
        <Button
          className="text-red/90 transition-colors bg-red/10 hover:bg-red/20 hover:text-red"
          startContent={<Icons.Bin size="sm" />}
          size={'sm'}
        >
          Удалить
        </Button>
      </CardContent>
    </Card>
  )
})

const AuctionSlotsList = (props: ComponentProps<'ul'>) => {
  const slots = useStoreSelector(auctionSlotsSelectors.getSlots)

  return slots.length > 0 ? (
    <ul {...props}>
      {slots.map((slot) => {
        return (
          <li key={slot.id}>
            <AuctionSlotCard {...slot} />
          </li>
        )
      })}
    </ul>
  ) : (
    <div className="flex flex-col gap-y-2 justify-center items-center">
      <Icons.Logo className="text-gray" width={32} height={32} />
      <Typography tag="p" className="text-gray-light font-medium font-golos-f">
        Slots not found
      </Typography>
    </div>
  )
}

export { AuctionSlotsList }
