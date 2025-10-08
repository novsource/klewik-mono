import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { DeleteSlotButton } from '~features/auction-slot/delete-slot/ui'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { SolidAuctionSlotCard } from '~entities/auction-slot/ui/card'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import type { ButtonProps } from '~shared/ui/button'
import { Button } from '~shared/ui/button'
import { Divider } from '~shared/ui/divider'
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
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~shared/ui/sheet'
import { Typography } from '~shared/ui/typograghy'

import { twSlotsStyles } from '~shared/utils'

import { useEditSlotDialog } from '../hooks'
import { editSlotSheetStyles } from '../styles'
import { ControlledEditSlotForm } from './edit-slot-form.ui'

export type EditSlotDialogProps = SheetProps & {
  slot: AuctionSlot
  trigger?: ReactNode
  closeButtonProps?: ButtonProps
}

export const EditSlotDialog = (props: EditSlotDialogProps) => {
  const {
    slot: inputSlot,
    trigger,
    open,
    onOpenChange,
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

  const closeDialog = () => {
    dialogState.setIsOpen(false)
  }

  const sheetStyles = useMemo(() => twSlotsStyles(editSlotSheetStyles), [])

  if (isMediaLargeThenTablet) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange} {...restProps}>
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
                  <Button
                    className="size-8"
                    isIconOnly
                    icon={<Icons.LargeCross width={14} height={14} />}
                    disabled={formQueryState.isLoading}
                    onClick={closeDialog}
                    {...closeButtonProps}
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
    <Sheet open={open} onOpenChange={onOpenChange} {...restProps}>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent className="overflow-scroll" isFullPageSize side="bottom">
        <Flex className="h-full w-full" direction="column">
          <SheetHeader className={sheetStyles.header}>
            <EditSlotDialogsIcon />
            <div className={sheetStyles.titleWrapper}>
              <SheetTitle className={sheetStyles.title}>
                Редактирование слота
              </SheetTitle>
              <SheetDescription>
                <Typography
                  className={sheetStyles.titleDescription}
                  tag="p"
                >
                  Измените параметры у слота
                </Typography>
              </SheetDescription>
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
          <Divider className="mb-4" />
          {dialogContent}
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
            <Button
              className="w-full"
              size="sm"
              icon={<Icons.LargeCross width={14} height={14} />}
              onClick={closeDialog}
              {...closeButtonProps}
            >
              Отмена
            </Button>
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
