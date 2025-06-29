import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'

import { useCreateSlotsForm } from '~features/auction-slot/create-slots/hooks'
import { ControlledCreateSlotForm } from '~features/auction-slot/create-slots/ui'

import { auctionSlotsActions as storeAuctionSlotsActions } from '~entities/auction-slot/store'

import { tailwindScreens } from '~shared/constants/tailwindcss'
import { useMediaQuery } from '~shared/hooks/use-media-query'
import { useActionCreators } from '~shared/lib/redux-toolkit'
import { Button } from '~shared/ui/button'
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
import { closeAllToasts, toastErrorNotification, toastSuccessNotification } from '~shared/ui/toaster/lib'
import { Typography } from '~shared/ui/typograghy'
import { getRandomHEXColor } from '~shared/utils/colors'

type CreateSlotsDialogProps = {
  multiplySlots?: boolean
  trigger: ReactNode
  isFullPageHeight?: boolean
}

function CreateSlotsDialog({
  multiplySlots = true,
  isFullPageHeight = true,
  trigger,
}: CreateSlotsDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [isSuccessCreated, setIsSuccessCreated] = useState(false)

  const auctionSlotsActions = useActionCreators(storeAuctionSlotsActions)

  const isMediaLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet})`,
  )

  const { form, state, submitForm, isLoading } = useCreateSlotsForm({ onSuccess: ({ slots }) => {
    auctionSlotsActions.addSlots(
      slots.map(slot => ({
        ...slot,
        id: 1,
        color: getRandomHEXColor(),
      })),
    )

    setIsSuccessCreated(true)
    setIsDialogOpen(false)
  }, onError: (error) => {
    toastErrorNotification(
      'Не удалось добавить слот(-ы)',
      error?.reason || error?.message,
      { className: 'right-[calc(var(--dialog-width-desktop)+12px)]' },
    )
  } })

  if (!isDialogOpen && state.isDirty) {
    form.reset()
    form.clearErrors()

    closeAllToasts()

    if (isSuccessCreated) {
      toastSuccessNotification('Слот(ы) успешно добавлен(ы) в аукцион!')
      setIsSuccessCreated(false)
    }
  }

  const handleFormSubmit = () => {
    const formSubmit = form.handleSubmit(submitForm)

    return formSubmit()
  }

  const dialogContent = useMemo(() => {
    return (
      <ControlledCreateSlotForm
        multiplySlots={multiplySlots}
        form={form}
        onSubmit={e => e.preventDefault()}
      />
    )
  }, [multiplySlots, form])

  if (isMediaLargeThenTablet) {
    return (
      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetTrigger>{trigger}</SheetTrigger>
        <SheetContent hideCloseButton shouldCloseOnOutsideClick={false}>
          <Flex
            className="h-full w-full gap-y-4"
            direction="column"
            align="center"
            justify="between"
          >
            <SheetHeader className="flex flex-col w-full gap-y-5">
              <Flex className="w-full h-8" justify="between">
                <Button
                  className="size-8"
                  disabled={isLoading || !state.isDirty}
                  isIconOnly
                  icon={<Icons.Reset size="sm" />}
                  onClick={() => form.reset()}
                />
                <Flex className="gap-x-2" align="center">
                  <Button
                    className="h-full"
                    size="sm"
                    variant="action"
                    disabled={isLoading || !state.isDirty}
                    startContent={<Icons.Plus size="sm" />}
                    onClick={handleFormSubmit}
                  >
                    Добавить
                  </Button>
                  <div className="h-2/3 w-0.25 bg-dark-accent mx-1" />
                  <Button
                    className="size-8"
                    isIconOnly
                    icon={<Icons.LargeCross width={14} height={14} />}
                    onClick={() => setIsDialogOpen(false)}
                  />
                </Flex>
              </Flex>
              <Flex className="gap-x-4" direction="row" align="center">
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

              </Flex>

            </SheetHeader>
            {/* <Divider /> */}
            <div className="w-full h-0.25 bg-dark-accent" />
            {dialogContent}
          </Flex>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer
      noBodyStyles
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      dismissible={state.isDirty}
      shouldScaleBackground={false}
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
function CreateSlotDialogIcon() {
  return (
    <div className="h-fit w-fit rounded-small bg-green-accent/50 p-0.5 outline-4 outline-green-accent/15">
      <Flex
        className="relative h-9 w-9 rounded-small p-1.25"
        align="center"
        justify="center"
      >
        <Icons.Slots
          className="text-white-accent"
          width="26"
          height="26"
          gradient
        />
      </Flex>
    </div>
  )
}
