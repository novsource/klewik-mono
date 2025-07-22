import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'

import { DeleteSlotButton } from '~features/auction-slot/delete-slot/ui'
import { useEditSlotForm } from '~features/auction-slot/edit-slot/hooks'
import { ControlledEditSlotForm } from '~features/auction-slot/edit-slot/ui/edit-slot-form.ui'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions } from '~entities/auction-slot/store'
import { SolidAuctionSlotCard } from '~entities/auction-slot/ui/card'

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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~shared/ui/sheet'
import { closeAllToasts, toastErrorNotification, toastSuccessNotification } from '~shared/ui/toaster/lib'
import { Typography } from '~shared/ui/typograghy'

type ResponsiveEditSlotDialogueProps = {
  slot: AuctionSlot
  trigger: ReactNode
}

const EditSlotDialog = ({
  slot: inputSlot,
  trigger,
}: ResponsiveEditSlotDialogueProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { updateSlot } = useActionCreators(auctionSlotsActions)

  const { form, formState, submitForm, isLoading } = useEditSlotForm(inputSlot, {
    onSuccess: (slot) => {
      updateSlot({ id: inputSlot.id, data: slot })

      setIsSuccess(true)
      setIsDialogOpen(false)
    },
    onError: (error) => {
      toastErrorNotification('Не удалось изменить слот', error.reason)
    },
  })

  const isMediaLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet})`,
  )

  if (!isDialogOpen && formState.isDirty) {
    form.reset()
    form.clearErrors()

    closeAllToasts()

    setIsDialogOpen(false)

    if (isSuccess) {
      toastSuccessNotification('Слот успешно изменен!')
    }
  }

  const handleFormSubmit = useCallback(() => {
    const submit = form.handleSubmit(submitForm)

    return submit()
  }, [form, submitForm])

  const dialogContent = useMemo(() => {
    return (
      <Flex className="h-full gap-y-6" direction="column">
        <SolidAuctionSlotCard auctionSlot={inputSlot} />
        <ControlledEditSlotForm
          form={form}
          onSubmit={e => e.preventDefault()}
        />

      </Flex>
    )
  }, [inputSlot, form])

  if (isMediaLargeThenTablet) {
    return (
      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetTrigger>{trigger}</SheetTrigger>
        <SheetContent>
          <Flex className="h-full w-full gap-y-4" direction="column">
            <SheetHeader className="flex flex-col w-full gap-y-5">
              <Flex className="w-full h-8" justify="between">
                <div className="h-full space-x-2">
                  <DeleteSlotButton
                    slotId={inputSlot.id}
                    className="size-8"
                    variant="error"
                    disabled={isLoading}
                    isIconOnly
                    icon={<Icons.Bin size="xs" />}
                    onClick={() => form.reset()}
                  />
                  <Button
                    className="size-8"
                    disabled={isLoading || !formState.isDirty}
                    isIconOnly
                    icon={<Icons.Reset size="sm" />}
                    onClick={() => form.reset()}
                  />
                </div>

                <Flex className="gap-x-2" align="center">
                  <Button
                    className="h-full"
                    size="sm"
                    variant="action"
                    disabled={isLoading || !formState.isDirty}
                    startContent={<Icons.Save width={14} height={14} />}
                    onClick={handleFormSubmit}
                  >
                    Сохранить
                  </Button>
                  <div className="h-2/3 w-0.25 bg-dark-accent mx-1" />
                  <Button
                    className="size-8"
                    isIconOnly
                    icon={<Icons.LargeCross width={14} height={14} />}
                    disabled={isLoading}
                    onClick={() => setIsDialogOpen(false)}
                  />
                </Flex>
              </Flex>
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
            <div className="w-full h-0.25 bg-dark-accent" />
            {dialogContent}
          </Flex>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer noBodyStyles open={isDialogOpen} onOpenChange={setIsDialogOpen} shouldScaleBackground={false}>
      <DrawerTrigger>{trigger}</DrawerTrigger>
      <DrawerContent className="px-4 pb-4" isFullPageHeight={true}>
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

function EditSlotDialogsIcon() {
  return (
    <div className="bg-[#FFC837]/50 h-fit w-fit rounded-small p-0.5 outline-4 outline-[#FFC837]/15">
      <Flex
        className="rounded-small size-9 p-1.75"
        align="center"
        justify="center"
      >
        <Icons.Pencil size="lg" gradient />
      </Flex>
    </div>
  )
}

export const ResponsiveEditSlotDialog = (
  props: ResponsiveEditSlotDialogueProps,
) => {
  return <EditSlotDialog {...props} />
}
