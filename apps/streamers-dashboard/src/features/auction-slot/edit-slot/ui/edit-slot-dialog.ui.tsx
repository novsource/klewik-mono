import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { FormProvider, useFormContext } from 'react-hook-form'

import { DeleteSlotButton } from '~features/auction-slot/delete-slot/ui'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { SlotPointsFormInput, SlotTitleFormInput } from '~entities/auction-slot/ui/form'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import type { ButtonProps } from '~shared/ui/button'
import { Button } from '~shared/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~shared/ui/drawer'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import type {
  SheetProps,
} from '~shared/ui/sheet'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~shared/ui/sheet'
import { Typography } from '~shared/ui/typograghy'

import { cn, mergeProps, twSlotsStyles } from '~shared/utils'

import { useEditSlotDialog } from '../hooks'
import { editSlotSheetStyles } from '../styles'
import { EditSlotDialogCard } from './dialog-card.ui'

export type EditSlotDialogProps = SheetProps & {
  slot: AuctionSlot
  trigger?: ReactNode
  closeButtonProps?: ButtonProps
}

export const EditSlotDialog = (props: EditSlotDialogProps) => {
  const {
    slot: inputSlot,
    trigger,
    closeButtonProps,
    ...restProps
  } = props

  const {
    dialogState,
    form,
    formState,
    queryState: formQueryState,
    submit,
  } = useEditSlotDialog(inputSlot)

  const isMediaLargeThenTablet = useMediaQuery(
    greaterThenDeviceWidthMediaQueries.tablet,
  )

  const closeDialog = () => {
    if (formState.isDirty || formQueryState.isLoading)
      return

    dialogState.setIsOpen(false)
  }

  const sheetStyles = useMemo(() => twSlotsStyles(editSlotSheetStyles), [])

  const isDismissible = !formState.isDirty || formQueryState.isLoading

  const mergedSheetProps = mergeProps({
    open: dialogState.isOpen,
    onOpenChange: dialogState.setIsOpen,
    dismissible: isDismissible,
  }, restProps)

  if (isMediaLargeThenTablet) {
    return (
      <Sheet {...mergedSheetProps}>
        {trigger && <SheetTrigger>{trigger}</SheetTrigger>}
        <SheetContent>
          <Flex className="h-full w-full gap-y-4" direction="column">
            <SheetHeader className="flex flex-col w-full gap-y-5">
              <Flex className="w-full h-8" justify="between">
                <div className="h-full space-x-2">
                  <DeleteSlotButton
                    slotId={inputSlot.id}
                    className="size-8"
                    variant="error"
                    disabled={formQueryState.isLoading}
                    isIconOnly
                    icon={<Icons.Bin size="xs" />}
                    onClick={() => form.reset()}
                  />
                  <Button
                    className="size-8"
                    disabled={formQueryState.isLoading || !formState.isDirty}
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
                    disabled={formQueryState.isLoading || !formState.isDirty}
                    startContent={<Icons.Save width={14} height={14} />}
                    onClick={submit}
                  >
                    Сохранить
                  </Button>
                  <div className="h-2/3 w-0.25 bg-dark-accent mx-1" />
                  <SheetClose nativeButton={false} className="relative right-0 top-0">
                    <Button
                      className="size-8"
                      isIconOnly
                      icon={<Icons.LargeCross width={14} height={14} />}
                      disabled={formQueryState.isLoading || formState.isDirty}
                      onClick={closeDialog}
                      {...closeButtonProps}
                    />
                  </SheetClose>
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
                  <EditSlotDialogTitle />
                  <EditSlotDialogDescription />
                </Flex>
              </Flex>
            </SheetHeader>

            <FormProvider {...form}>
              <EditSlotForm />
            </FormProvider>

          </Flex>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet {...mergedSheetProps}>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent className="overflow-scroll" isFullPageSize side="bottom">
        <Flex className="h-full w-full" direction="column">
          <SheetHeader className={sheetStyles.header}>
            <EditSlotDialogsIcon />
            <div className={sheetStyles.titleWrapper}>
              <EditSlotDialogTitle />
              <EditSlotDialogDescription />
            </div>
            <Drawer noBodyStyles>
              <DrawerTrigger>
                <Button
                  className={sheetStyles.closeButton}
                  isIconOnly
                  icon={<Icons.Dots width={14} height={14} />}
                />
              </DrawerTrigger>
              <DrawerContent className="px-4">
                <DrawerHeader>
                  <DrawerTitle>
                    Действия
                  </DrawerTitle>
                </DrawerHeader>
                <Flex className="w-full gap-y-3 pb-4" direction="column">
                  <Button
                    className="w-full"
                    startContent={<Icons.Reset width={12} height={12} />}
                  >
                    Сбросить
                  </Button>
                  <Button
                    className="w-full"
                    variant="error"
                    startContent={<Icons.Bin width={12} height={12} />}
                  >
                    Удалить слот
                  </Button>
                </Flex>
              </DrawerContent>
            </Drawer>

          </SheetHeader>

          <FormProvider {...form}>
            <EditSlotForm />
          </FormProvider>

          <Flex className="gap-y-2 pt-2" direction="column">
            <Button
              className="w-full"
              variant="action"
              size="sm"
              disabled={formQueryState.isLoading || !formState.isDirty}
              startContent={<Icons.Save width={14} height={14} />}
              onClick={submit}
            >
              Сохранить
            </Button>
            <SheetClose className="relative top-0 right-0">
              <Button
                className="w-full"
                size="sm"
                icon={<Icons.LargeCross width={14} height={14} />}
                onClick={closeDialog}
                {...closeButtonProps}
              >
                Отмена
              </Button>
            </SheetClose>
          </Flex>
        </Flex>
      </SheetContent>
    </Sheet>
  )
}

function EditSlotDialogsIcon() {
  return (
    <div className="bg-[#FFC837]/50 h-fit w-fit rounded-small p-0.25 outline-4 outline-[#FFC837]/15">
      <Flex
        className="relative size-7 tablet:size-8 rounded-small p-1.25"
        align="center"
        justify="center"
      >
        <Icons.Pencil gradient />
      </Flex>
    </div>
  )
}

function EditSlotForm() {
  const { control } = useFormContext()

  return (
    <form className="flex flex-col gap-y-2 h-full">
      <EditSlotDialogCard
        className="pt-3 pb-1"
        contentPosition="bottom"
        title="Слот"
        titleIcon={<Icons.Slots className="text-gray" size="xs" />}
      >
        <SlotTitleFormInput
          variant="ghost"
          name="title"
          control={control}
        />
      </EditSlotDialogCard>
      <EditSlotDialogCard
        className="py-2"
        contentPosition="right"
        title="Очки"
        titleIcon={<Icons.Coin className="text-gray" size="sm" />}
      >
        <SlotPointsFormInput
          control={control}
          name="points"
          showPercentInput={false}
          pointsInputProps={{
            variant: 'ghost',
            label: undefined,
            startContent: undefined,
            slotClassNames: { input: 'text-right text-white/80' },
            isAllowed: value =>
              value?.floatValue ? value.floatValue <= 1_000_000 : true,
          }}
        />
      </EditSlotDialogCard>
    </form>
  )
}

function EditSlotDialogTitle() {
  return <SheetTitle>Обзор слота</SheetTitle>
}

function EditSlotDialogDescription() {
  return (
    <SheetDescription>
      <Typography
        className={cn(editSlotSheetStyles.titleDescription)}
        tag="p"
      >
        Измените параметры слота
      </Typography>
    </SheetDescription>
  )
}
