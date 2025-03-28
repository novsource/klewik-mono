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
import { Icons } from '~shared/ui/icons'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~shared/ui/sheet/ui'
import { Typography } from '~shared/ui/typograghy'

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
            <Flex className="gap-y-4" direction="column">
              <Flex
                className="border-1 border-dark-accent rounded-medium w-fit"
                align="center"
                justify="center"
              >
                <Flex
                  className="bg-dark h-full w-full p-2.5 rounded-medium"
                  align="center"
                  justify="center"
                >
                  <Icons.Pencil className="text-gray-accent" size="sm" />
                </Flex>
              </Flex>
              <Flex className="gap-y-1" direction="column" align="start">
                <Typography tag="h3">Изменение слота</Typography>
                <Typography className="text-gray-accent font-normal" tag="p">
                  Здесь вы можете изменить название и количество очков у слота
                </Typography>
              </Flex>
            </Flex>
          </SheetHeader>
          {dialogContent}
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
