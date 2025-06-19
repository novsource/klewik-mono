import { useMemo } from 'react'

import { EditSlotForm } from '~features/auction-slot/edit-slot/ui'

import { auctionSlotsActions } from '~entities/auction-slot/store'
import { AuctionSlotCard } from '~entities/auction-slot/ui/card'

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
        <AuctionSlotCard
          slotClassNames={{ base: 'max-tablet:py-1' }}
          {...inputSlot}
        />
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
          <Flex className="h-full w-full gap-y-4" direction="column">
            <SheetHeader>
              <Flex className="h-full gap-x-4" align="center">
                <EditSlotDialogsIcon />
                <Flex
                  className="h-full"
                  direction="column"
                  align="start"
                  justify="start"
                >
                  <SheetTitle>Редактирование слота</SheetTitle>
                  <Typography
                    className="leading-4 font-normal text-gray-accent"
                    tag="p"
                  >
                    Измените параметры у слота
                  </Typography>
                </Flex>
              </Flex>
            </SheetHeader>
            <Divider />
            {dialogContent}
          </Flex>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer noBodyStyles open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DrawerTrigger>{trigger}</DrawerTrigger>
      <DrawerContent className="px-4 pb-4" isFullPageHeight={isFullPageHeight}>
        <DrawerHeader className="flex-row items-center gap-x-4 px-2">
          <EditSlotDialogsIcon />
          <Flex className="" direction="column">
            <DrawerTitle className="leading-5 font-medium text-white">
              Изменение слота
            </DrawerTitle>
            <DrawerDescription asChild>
              <Typography tag="p">Измените данные слота</Typography>
            </DrawerDescription>
          </Flex>
        </DrawerHeader>
        {dialogContent}
      </DrawerContent>
    </Drawer>
  )
}

const EditSlotDialogsIcon = () => {
  return (
    <div className="pencil-icon-gradient h-fit w-fit rounded-small p-0.5 outline-2 outline-[#F8C1AE]/10">
      <Flex
        className="rounded-small border-[0.5px] border-[#F8C1AE]/30 p-1.75"
        align="center"
        justify="center"
      >
        <Icons.Pencil size="lg" gradient />
      </Flex>
    </div>
  )
}
