import { ReactNode, useState } from 'react'

import { CreateSlotsForm } from '~features/auction-slot/create-slots/ui'

import { auctionSlotsActions as storeAuctionSlotsActions } from '~entities/auction-slot/store'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~shared/ui/sheet/ui/sheet'
import { Typography } from '~shared/ui/typograghy'

import { tailwindScreens } from '~shared/constants/tailwindcss'

type CreateSlotsDialogProps = {
  multiplySlots?: boolean
  trigger: ReactNode
}

const CreateSlotsDialog = ({
  multiplySlots = true,
  trigger,
}: CreateSlotsDialogProps) => {
  const [isSheetOpened, setIsSheetOpened] = useState(false)

  const auctionSlotsActions = useActionCreators(storeAuctionSlotsActions)

  const isMediaLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet})`
  )

  return (
    <Sheet open={isSheetOpened} onOpenChange={setIsSheetOpened}>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent side={isMediaLargeThenTablet ? 'right' : 'bottom'}>
        <SheetHeader>
          <Flex className="gap-y-4" direction="column">
            <Flex
              className="bg-dark h-full p-2.5 rounded-medium border-1 border-dark-accent/50 w-fit"
              align="center"
              justify="center"
            >
              <Icons.Plus className="text-gray-accent" size="sm" />
            </Flex>
          </Flex>
          <Flex className="gap-y-1" direction="column" align="start">
            <Typography tag="h3">Добавление слота</Typography>
            <Typography className="text-gray-accent font-normal" tag="p">
              Здесь вы можете самостоятельно добавить слоты в аукцион. Очки,
              которые будут указаны в добавленных слотах будут суммированны и
              вычтены из "очки стримера"
            </Typography>
          </Flex>
        </SheetHeader>
        <CreateSlotsForm
          multiplySlots={multiplySlots}
          onSuccess={(slots) => {
            auctionSlotsActions.addSlots(
              slots.map((slot) => ({
                ...slot,
                id: 1,
                color: '#FFF',
              }))
            )
            setIsSheetOpened(false)
          }}
        />
      </SheetContent>
    </Sheet>
  )
}

export { CreateSlotsDialog }
