import { ReactNode, useState } from 'react'

import { EditSlotForm } from '~features/auction-slot/edit-slot/ui'
import { AuctionSlotCard } from '~features/auction-slot/watch-slots/ui'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions } from '~entities/auction-slot/store'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~shared/ui/sheet/ui/sheet'
import { Typography } from '~shared/ui/typograghy'

import { tailwindScreens } from '~shared/constants/tailwindcss'

export type EditSlotSheetProps = {
  slot: AuctionSlot
  trigger: ReactNode
  isOpen?: boolean
}

const EditSlotSheet = ({
  slot: inputSlot,
  trigger,
  ...props
}: EditSlotSheetProps) => {
  const [isOpen, setIsOpen] = useState(props.isOpen ?? false)

  const { updateSlot } = useActionCreators(auctionSlotsActions)

  const isMediaLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet})`
  )

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent side={isMediaLargeThenTablet ? 'right' : 'bottom'}>
        <SheetHeader className="mb-4">
          <Flex className="gap-y-4" direction="column">
            <Flex
              className="border-1 border-red/30 rounded-medium w-fit"
              align="center"
              justify="center"
            >
              <Flex
                className="bg-red/10 h-full w-full p-2.5 rounded-medium"
                align="center"
                justify="center"
              >
                <Icons.Bin className="text-red" size="sm" />
              </Flex>
            </Flex>
            <Flex className="gap-y-1.5" direction="column" align="start">
              <Typography tag="h3">Удаление аукциона</Typography>
              <Typography className="text-gray-accent font-normal" tag="p">
                С глаз долой и из сердца вон
              </Typography>
            </Flex>
          </Flex>
        </SheetHeader>
        <Flex className="h-full gap-y-6" direction="column">
          <AuctionSlotCard {...inputSlot} />
          <EditSlotForm
            targetSlot={inputSlot}
            watchingFields={{ points: true, name: true }}
            onFieldValueChange={(fields) => {
              console.log(fields.points)
            }}
            onSuccess={(slot) => {
              updateSlot({ id: inputSlot.id, data: slot })
              setIsOpen(false)
            }}
          />
        </Flex>
      </SheetContent>
    </Sheet>
  )
}

export { EditSlotSheet }
