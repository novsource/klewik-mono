import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'

import { auctionSlotsActions as storeAuctionSlotsActions } from '~entities/auction-slot/store'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
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
} from '~shared/ui/sheet'
import { closeAllToasts, toastErrorNotification, toastSuccessNotification } from '~shared/ui/toaster/lib'
import { Typography } from '~shared/ui/typograghy'

import { twSlotsStyles } from '~shared/utils'
import { getRandomHEXColor } from '~shared/utils/colors'

import { useCreateSlotsForm } from '../hooks'
import { createSlotsSheetStyles } from '../styles'
import { ControlledCreateSlotForm } from './create-slots-form'

export type CreateSlotsDialogProps = {
  multiplySlots?: boolean
  trigger: ReactNode
}

export const CreateSlotsDialog = (props: CreateSlotsDialogProps) => {
  const {
    multiplySlots = true,
    trigger,
  } = props

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSuccessCreated, setIsSuccessCreated] = useState(false)

  const auctionSlotsActions = useActionCreators(storeAuctionSlotsActions)

  const isMediaLargeThenTablet = useMediaQuery(
    greaterThenDeviceWidthMediaQueries.tablet,
  )

  const { form, state: formState, submitForm, isLoading } = useCreateSlotsForm({ onSuccess: (slots) => {
    auctionSlotsActions.addSlots(
      slots.map(slot => ({
        ...slot,
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

  if (!isDialogOpen && formState.isDirty) {
    form.reset()
    form.clearErrors()

    closeAllToasts()

    if (isSuccessCreated) {
      toastSuccessNotification('Слот(ы) успешно добавлен(ы) в аукцион!')
      setIsSuccessCreated(false)
    }
  }

  const handleFormSubmit = form.handleSubmit(submitForm)

  const resetForm = () => {
    form.reset()
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
  }

  const isShouldDisableSubmit = isLoading || !formState.isValid || !formState.isDirty

  const dialogContent = useMemo(() => {
    return (
      <ControlledCreateSlotForm
        multiplySlots={multiplySlots}
        form={form}
      />
    )
  }, [multiplySlots, form])

  const sheetStyles = useMemo(() => twSlotsStyles(createSlotsSheetStyles), [])

  if (isMediaLargeThenTablet) {
    return (
      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen} disablePointerDismissal={formState.isDirty}>
        <SheetTrigger>{trigger}</SheetTrigger>
        <SheetContent side="right">
          <Flex
            className={sheetStyles.contentWrapper}
            direction="column"
            align="center"
          >
            <SheetHeader className={sheetStyles.header}>
              <Flex className={sheetStyles.headerPanelWrapper} justify="between">
                <Button
                  className={sheetStyles.resetButton}
                  disabled={isLoading || !formState.isDirty}
                  isIconOnly
                  icon={<Icons.Reset size="xs" />}
                  onClick={resetForm}
                />
                <Flex className={sheetStyles.panelActionsButtons} align="center">
                  <Button
                    className={sheetStyles.submitButton}
                    size="xs"
                    variant="action"
                    disabled={isShouldDisableSubmit}
                    startContent={<Icons.Plus />}
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
                  <SheetDescription>
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
    <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen} disablePointerDismissal={formState.isDirty}>
      <SheetTrigger className="w-full">{trigger}</SheetTrigger>
      <SheetContent className="px-0" side="bottom" isFullPageSize>
        <div className={sheetStyles.contentWrapper}>
          <SheetHeader className={sheetStyles.header}>
            <CreateSlotDialogIcon />
            <div className={sheetStyles.titleWrapper}>
              <SheetTitle className={sheetStyles.title}>
                Добавление слотов
              </SheetTitle>
              <SheetDescription>
                <Typography
                  className={sheetStyles.titleDescription}
                  tag="p"
                >
                  Увеличьте количество слотов
                </Typography>
              </SheetDescription>
            </div>
            <Button
              className={sheetStyles.closeButton}
              isIconOnly
              icon={<Icons.LargeCross width={14} height={14} />}
              onClick={closeDialog}
            />
          </SheetHeader>
          <Divider />
          <div className="w-full h-full overflow-scroll">
            {dialogContent}
          </div>
          <Flex className={sheetStyles.footer}>
            <Button
              className={sheetStyles.resetButton}
              disabled={isLoading || !formState.isDirty}
              startContent={<Icons.Reset size="xs" />}
              onClick={resetForm}
            >
              Сбросить
            </Button>
            <Button
              className={sheetStyles.submitButton}
              variant="action"
              disabled={isShouldDisableSubmit}
              startContent={<Icons.Plus size="lg" />}
              onClick={handleFormSubmit}
            >
              Добавить
            </Button>
          </Flex>
        </div>
      </SheetContent>
    </Sheet>
  )
}

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
