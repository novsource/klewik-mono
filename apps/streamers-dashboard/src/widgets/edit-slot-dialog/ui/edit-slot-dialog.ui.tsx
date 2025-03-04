import { ReactNode, useState } from 'react'

import { EditSlotForm } from '~features/auction-slot/edit-slot/ui'
import { AuctionSlotCard } from '~features/auction-slot/watch-slots/ui'

import { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions } from '~entities/auction-slot/store'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~shared/ui/sheet/ui/sheet'

import { tailwindScreens } from '~shared/constants/tailwindcss'

type EditSlotSheetProps = {
  slot: AuctionSlot
  trigger: ReactNode
}

const EditSlotSheet = ({ slot: inputSlot, trigger }: EditSlotSheetProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const { updateSlot } = useActionCreators(auctionSlotsActions)

  const isMediaLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet})`
  )

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent side={isMediaLargeThenTablet ? 'right' : 'bottom'}>
        <SheetHeader className="mb-4">
          <SheetTitle>Изменение слота</SheetTitle>
        </SheetHeader>
        <div className="h-full flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-2">
            <AuctionSlotCard {...inputSlot} />
          </div>

          <EditSlotForm
            targetSlot={inputSlot}
            onSuccess={(slot) => {
              updateSlot({ id: inputSlot.id, data: slot })
              setIsOpen(false)
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { EditSlotSheet }
