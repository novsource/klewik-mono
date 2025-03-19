import { useMemo } from 'react'

import { EditSlotForm } from '~features/auction-slot/edit-slot/ui'
import { AuctionSlotCard } from '~features/auction-slot/watch-slots/ui'

import { auctionSlotsActions } from '~entities/auction-slot/store'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~shared/ui/drawer'
import { Flex } from '~shared/ui/flex'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~shared/ui/sheet/ui'

import { tailwindScreens } from '~shared/constants/tailwindcss'

import { EditSlotDrawerProps } from '../../drawer/ui'
import { EditSlotSheetProps } from '../../sheet/ui'
import {
  ResponsiveEditSlotDialogProvider,
  useResponsiveEditSlotDialogContext,
} from '../context'

type ResponsiveEditSlotDialogueProps = EditSlotSheetProps & EditSlotDrawerProps

export const ResponsiveEditSlotDialogue = (
  props: ResponsiveEditSlotDialogueProps
) => {
  return (
    <ResponsiveEditSlotDialogProvider>
      <EditSlotDialogue {...props} />
    </ResponsiveEditSlotDialogProvider>
  )
}

const EditSlotDialogue = ({
  slot: inputSlot,
  trigger,
  isFullPageHeight,
}: ResponsiveEditSlotDialogueProps) => {
  const {
    state: { isDialogOpen, formInputState },
    dispatch: { setFormInputState, setIsDialogOpen },
  } = useResponsiveEditSlotDialogContext()

  const isMediaLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet})`
  )

  const { updateSlot } = useActionCreators(auctionSlotsActions)

  const dialogContent = useMemo(() => {
    return (
      <Flex className="h-full gap-y-6" direction="column">
        <AuctionSlotCard {...inputSlot} />
        <EditSlotForm
          defaultValues={
            isDialogOpen
              ? formInputState !== null
                ? formInputState
                : undefined
              : undefined
          }
          targetSlot={inputSlot}
          watchingFields={{ points: true, name: true }}
          onFieldValueChange={(fields) => {
            setFormInputState({
              name: fields.name ?? '',
              points: fields.points ?? '',
            })
          }}
          onSuccess={(slot) => {
            updateSlot({ id: inputSlot.id, data: slot })

            setIsDialogOpen(false)
            setFormInputState(null)
          }}
        />
      </Flex>
    )
  }, [setIsDialogOpen, setFormInputState, inputSlot])

  if (isMediaLargeThenTablet) {
    return (
      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetTrigger>{trigger}</SheetTrigger>
        <SheetContent side={isMediaLargeThenTablet ? 'right' : 'bottom'}>
          <SheetHeader className="mb-4">
            <SheetTitle>Изменение слота</SheetTitle>
            {dialogContent}
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer noBodyStyles open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DrawerTrigger>{trigger}</DrawerTrigger>
      <DrawerContent className="px-4" isFullPageHeight={isFullPageHeight}>
        <DrawerHeader>
          <DrawerTitle className="text-white">Изменение слота</DrawerTitle>
        </DrawerHeader>
        {dialogContent}
      </DrawerContent>
    </Drawer>
  )
}
