import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'

import { useCreateSlotsForm } from '~features/auction-slot/create-slots/hooks'
import { ControlledCreateSlotForm } from '~features/auction-slot/create-slots/ui'

import { auctionSlotsActions as storeAuctionSlotsActions } from '~entities/auction-slot/store'

import { tailwindScreens } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Divider } from '~shared/ui/divider'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
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

import { twSlotsStyles } from '~shared/utils'
import { getRandomHEXColor } from '~shared/utils/colors'

import { createSlotsDialogStyles, createSlotsSheetStyles } from '../styles'

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

  const handleFormSubmit = form.handleSubmit(submitForm)

  const dialogContent = useMemo(() => {
    return (
      <ControlledCreateSlotForm
        multiplySlots={multiplySlots}
        form={form}
      />
    )
  }, [multiplySlots, form])

  const sheetStyles = useMemo(() => twSlotsStyles(createSlotsSheetStyles), [])
  const drawerStyles = useMemo(() => twSlotsStyles(createSlotsDialogStyles), [])

  if (isMediaLargeThenTablet) {
    return (
      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent hideCloseButton shouldCloseOnOutsideClick={!state.isDirty}>
          <Flex
            className={sheetStyles.contentWrapper}
            direction="column"
            align="center"
          >
            <SheetHeader className={sheetStyles.header}>
              <Flex className={sheetStyles.headerPanelWrapper} justify="between">
                <Button
                  className={sheetStyles.resetButton}
                  disabled={isLoading || !state.isDirty}
                  isIconOnly
                  icon={<Icons.Reset size="sm" />}
                  onClick={() => form.reset()}
                />
                <Flex className={sheetStyles.panelActionsButtons} align="center">
                  <Button
                    className={sheetStyles.submitButton}
                    size="sm"
                    variant="action"
                    disabled={isLoading || !state.isDirty}
                    startContent={<Icons.Plus size="sm" />}
                    onClick={handleFormSubmit}
                  >
                    Добавить
                  </Button>
                  <Divider className="mx-1" orientation="vertical" />
                  <Button
                    className={sheetStyles.closeButton}
                    isIconOnly
                    icon={<Icons.LargeCross width={14} height={14} />}
                    onClick={() => setIsDialogOpen(false)}
                  />
                </Flex>
              </Flex>
              <Flex className={sheetStyles.titleWrapper} direction="row" align="center">
                <CreateSlotDialogIcon />
                <Flex direction="column" align="start">
                  <SheetTitle>Добавление слотов</SheetTitle>
                  <SheetDescription asChild>
                    <Typography
                      className={sheetStyles.titleDescription}
                      tag="p"
                    >
                      Увеличьте количество слотов в аукционе
                    </Typography>
                  </SheetDescription>
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
    <Drawer
      noBodyStyles
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      dismissible={false}
      repositionInputs={true}
    >
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent isFullPageHeight={isFullPageHeight} hidePill>
        <div className={drawerStyles.contentWrapper}>
          <DrawerHeader className={drawerStyles.header}>
            <CreateSlotDialogIcon />
            <div className={drawerStyles.titleWrapper}>
              <DrawerTitle className={drawerStyles.title}>
                Добавление слотов
              </DrawerTitle>
              <DrawerDescription asChild>
                <Typography tag="p">
                  Добавьте нужные слоты
                </Typography>
              </DrawerDescription>
            </div>
            <Button
              className={drawerStyles.closeButton}
              isIconOnly
              icon={<Icons.LargeCross width={14} height={14} />}
              onClick={() => setIsDialogOpen(false)}
            />
          </DrawerHeader>
          <Divider className="mb-4" />
          {dialogContent}
          <DrawerFooter className={drawerStyles.footer}>
            <Button
              className={drawerStyles.resetButton}
              size="sm"
              disabled={!state.isDirty}
              startContent={<Icons.Reset size="xs" />}
              onClick={() => form.reset()}
            >
              Сбросить
            </Button>
            <Button
              className={drawerStyles.submitButton}
              variant="action"
              size="sm"
              disabled={!state.isDirty}
              startContent={<Icons.Plus />}
              onClick={handleFormSubmit}
            >
              Добавить
            </Button>
          </DrawerFooter>
        </div>

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
        className="relative size-8 tablet:size-9 rounded-small p-1.25"
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
