import { ReactNode, useState } from 'react'

import { CreateSlotsForm } from '~features/auction-slot/create-slots/ui'

import { auctionSlotsActions as storeAuctionSlotsActions } from '~entities/auction-slot/store'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~shared/ui/sheet/ui/sheet'

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
          <SheetTitle>Добавление слота</SheetTitle>
        </SheetHeader>
        <SheetDescription className="mb-6 text-sm">
          Здесь вы можете самостоятельно добавить слоты в аукцион. Очки, которые
          будут указаны в добавленных слотах будут суммированны и вычтены из
          "очки стримера"
        </SheetDescription>
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
