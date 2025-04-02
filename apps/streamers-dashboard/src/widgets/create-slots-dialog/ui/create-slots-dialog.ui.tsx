import { ReactNode, useState } from 'react'

import { CreateSlotsForm } from '~features/auction-slot/create-slots/ui'

import { auctionSlotsActions as storeAuctionSlotsActions } from '~entities/auction-slot/store'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import { Divider } from '~shared/ui/divider'
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
        <Flex
          className="w-full h-full gap-y-4"
          direction="column"
          align="center"
          justify="between"
        >
          <SheetHeader className="flex flex-row gap-x-4 w-full">
            <CreateSlotDialogIcon />
            <Flex direction="column" align="start">
              <SheetTitle>Добавление слотов</SheetTitle>
              <SheetDescription asChild>
                <Typography
                  className="text-gray-accent font-normal leading-4"
                  tag="p"
                >
                  Увеличьте количество слотов в аукционе
                </Typography>
              </SheetDescription>
            </Flex>
          </SheetHeader>
          <Divider />
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
        </Flex>
      </SheetContent>
    </Sheet>
  )
}

/**
  @todo Refactor create-slots dialog icon
*/
const CreateSlotDialogIcon = () => {
  return (
    <div className="w-fit h-fit bg-gradient-to-r from-[#1D976C]/30 to-[#93F9B9]/30 p-0.5 rounded-small outline-2 outline-[#6FCF97]/10">
      <Flex
        className="relative p-1.25 border-[0.5px] border-[#93F9B9]/30 rounded-small w-10 h-10"
        align="center"
        justify="center"
      >
        <Icons.Slots
          className="absolute left-1 bottom-1"
          width="26"
          height="26"
          gradient
        />

        <Icons.Plus
          className="absolute right-0 top-[2px]"
          width="16"
          height="16"
          strokeWidth={1}
          gradient
        />
      </Flex>
    </div>
  )
}

export { CreateSlotsDialog }
