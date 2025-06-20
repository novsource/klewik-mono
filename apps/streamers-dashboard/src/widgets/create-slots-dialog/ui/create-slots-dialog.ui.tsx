import { ReactNode, useEffect, useMemo, useState } from 'react'

import { useCreateSlotsForm } from '~features/auction-slot/create-slots/hooks'
import { CreateSlotsForm } from '~features/auction-slot/create-slots/ui'

import { auctionSlotsActions as storeAuctionSlotsActions } from '~entities/auction-slot/store'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import { Divider } from '~shared/ui/divider'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~shared/ui/drawer'
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
  isFullPageHeight?: boolean
}

const CreateSlotsDialog = ({
  multiplySlots = true,
  isFullPageHeight = true,
  trigger,
}: CreateSlotsDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const auctionSlotsActions = useActionCreators(storeAuctionSlotsActions)

  const isMediaLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet})`
  )

  const { formMethods, formState } = useCreateSlotsForm()

  const dialogContent = useMemo(() => {
    return (
      <CreateSlotsForm
        multiplySlots={multiplySlots}
        formMethods={formMethods}
        onSuccess={(slots) => {
          auctionSlotsActions.addSlots(
            slots.map((slot) => ({
              ...slot,
              id: 1,
              color: '#FFF',
            }))
          )
          setIsDialogOpen(false)
        }}
      />
    )
  }, [multiplySlots, auctionSlotsActions, setIsDialogOpen, formMethods])

  useEffect(() => {
    if (!isDialogOpen) {
      formMethods.reset()
    }
  }, [formMethods, isDialogOpen])

  if (isMediaLargeThenTablet) {
    return (
      <CreateSlotsSheet
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        trigger={trigger}
      >
        {dialogContent}
      </CreateSlotsSheet>
    )
  }

  return (
    <Drawer
      noBodyStyles
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      dismissible={!formState.isDirty}
    >
      <DrawerTrigger>{trigger}</DrawerTrigger>
      <DrawerContent className="px-4 pb-4" isFullPageHeight={isFullPageHeight}>
        <DrawerHeader className="flex-row items-center gap-x-4 px-2">
          <CreateSlotDialogIcon />
          <Flex className="" direction="column">
            <DrawerTitle className="leading-5 font-medium text-white">
              Добавление слотов
            </DrawerTitle>
            <DrawerDescription asChild>
              <Typography tag="p">
                Увеличьте количество слотов в аукционе
              </Typography>
            </DrawerDescription>
          </Flex>
        </DrawerHeader>
        {dialogContent}
      </DrawerContent>
    </Drawer>
  )
}

export { CreateSlotsDialog }

/**
  @todo Refactor create-slots dialog icon
*/
const CreateSlotDialogIcon = () => {
  return (
    <div className="h-fit w-fit rounded-small bg-gradient-to-r from-[#1D976C]/30 to-[#93F9B9]/30 p-0.5 outline-2 outline-[#6FCF97]/10">
      <Flex
        className="relative h-10 w-10 rounded-small border-[0.5px] border-[#93F9B9]/30 p-1.25"
        align="center"
        justify="center"
      >
        <Icons.Slots
          className="absolute bottom-1 left-1"
          width="26"
          height="26"
          gradient
        />

        <Icons.Plus
          className="absolute top-[2px] right-0"
          width="16"
          height="16"
          strokeWidth={1}
          gradient
        />
      </Flex>
    </div>
  )
}

type CreateSlotSheetProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  trigger: ReactNode
  children: ReactNode
}

const CreateSlotsSheet = (props: CreateSlotSheetProps) => {
  const { isOpen, onOpenChange, trigger, children } = props

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent>
        <Flex
          className="h-full w-full gap-y-4"
          direction="column"
          align="center"
          justify="between"
        >
          <SheetHeader className="flex w-full flex-row gap-x-4">
            <CreateSlotDialogIcon />
            <Flex direction="column" align="start">
              <SheetTitle>Добавление слотов</SheetTitle>
              <SheetDescription asChild>
                <Typography
                  className="leading-4 font-normal text-gray-accent"
                  tag="p"
                >
                  Увеличьте количество слотов в аукционе
                </Typography>
              </SheetDescription>
            </Flex>
          </SheetHeader>
          <Divider />
          {children}
        </Flex>
      </SheetContent>
    </Sheet>
  )
}
