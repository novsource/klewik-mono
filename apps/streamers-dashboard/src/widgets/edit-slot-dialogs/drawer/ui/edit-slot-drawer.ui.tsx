import { ReactNode, useState } from 'react'

import { EditSlotForm } from '~features/auction-slot/edit-slot/ui'
import { AuctionSlotCard } from '~features/auction-slot/watch-slots/ui'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions } from '~entities/auction-slot/store'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~shared/ui/drawer'

import { cn } from '~shared/utils'

export type EditSlotDrawerProps = {
  trigger: ReactNode
  slot: AuctionSlot
  isFullPageHeight?: boolean
}

const EditSlotDrawer = ({
  trigger,
  slot: inputSlot,
  isFullPageHeight = false,
}: EditSlotDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const { updateSlot } = useActionCreators(auctionSlotsActions)

  return (
    <Drawer noBodyStyles open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="px-4" isFullPageHeight={isFullPageHeight}>
        <DrawerHeader>
          <DrawerTitle className="text-white">Изменение слота</DrawerTitle>
        </DrawerHeader>
        <div className={cn('h-full flex flex-col gap-y-6 pb-6')}>
          <div className="flex flex-col gap-y-2">
            <AuctionSlotCard {...inputSlot} />
          </div>

          <EditSlotForm
            className={cn(
              'flex flex-col h-full',
              !isFullPageHeight ? 'gap-y-12' : 'gap-y-0 justify-between'
            )}
            targetSlot={inputSlot}
            onSuccess={(slot) => {
              updateSlot({ id: inputSlot.id, data: slot })
              setIsOpen(false)
            }}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export { EditSlotDrawer }
