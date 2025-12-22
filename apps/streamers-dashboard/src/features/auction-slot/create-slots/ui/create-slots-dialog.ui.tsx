import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'

import {
  DesktopAppDialog,
  DesktopAppDialogClose,
  DesktopAppDialogContent,
  DesktopAppDialogHeader,
  DesktopAppDialogHeaderActionsPanel,
  DesktopAppDialogHeaderTopPanel,
  DesktopAppDialogTitle,
  DesktopAppDialogTrigger,
  MobileAppDialog,
  MobileAppDialogContent,
  MobileAppDialogExtraActions,
  MobileAppDialogFooter,
  MobileAppDialogHeader,
  MobileAppDialogHeaderTitle,
  MobileAppDialogTrigger,
} from '~shared/components/app-dialog'

import { auctionSlotsActions as storeAuctionSlotsActions } from '~entities/auction-slot/store'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Divider } from '~shared/ui/divider'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { closeAllToasts, toastErrorNotification, toastSuccessNotification } from '~shared/ui/toaster/lib'

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

  const resetAndCloseDialog = () => {
    form.reset()
    setIsDialogOpen(false)
  }

  const isShouldDisableSubmit = isLoading || !formState.isValid || !formState.isDirty

  const sheetStyles = useMemo(() => twSlotsStyles(createSlotsSheetStyles), [])

  if (isMediaLargeThenTablet) {
    return (
      <DesktopAppDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} disablePointerDismissal={formState.isDirty}>
        <DesktopAppDialogTrigger>{ trigger }</DesktopAppDialogTrigger>

        <DesktopAppDialogContent>
          <DesktopAppDialogHeader>
            <DesktopAppDialogHeaderTopPanel>
              <Button
                className={sheetStyles.resetButton}
                disabled={isLoading || !formState.isDirty}
                isIconOnly
                icon={<Icons.Reset size="xs" />}
                onClick={resetForm}
              />

              <DesktopAppDialogHeaderActionsPanel>
                <Button
                  className={sheetStyles.submitButton}
                  variant="action"
                  size="xs"
                  disabled={isShouldDisableSubmit}
                  startContent={<Icons.Plus />}
                  onClick={handleFormSubmit}
                >
                  Добавить
                </Button>

                <Divider className="mx-1" orientation="vertical" />

                <DesktopAppDialogClose>
                  <Button
                    className={sheetStyles.closeButton}
                    isIconOnly
                    icon={<Icons.LargeCross width={14} height={14} />}
                    onClick={() => setIsDialogOpen(false)}
                  />
                </DesktopAppDialogClose>

              </DesktopAppDialogHeaderActionsPanel>
            </DesktopAppDialogHeaderTopPanel>

            <DesktopAppDialogTitle
              icon={<CreateSlotDialogIcon />}
              title="Добавление слотов"
              description="Увеличьте количество слотов в аукционе"
            />
          </DesktopAppDialogHeader>

          <ControlledCreateSlotForm
            multiplySlots={multiplySlots}
            form={form}
          />

        </DesktopAppDialogContent>
      </DesktopAppDialog>
    )
  }

  return (
    <MobileAppDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} disablePointerDismissal={formState.isDirty}>
      <MobileAppDialogTrigger className="w-full">{ trigger }</MobileAppDialogTrigger>

      <MobileAppDialogContent>
        <MobileAppDialogHeader>
          <MobileAppDialogHeaderTitle
            icon={<CreateSlotDialogIcon />}
            title="Добавление слотов"
            description="Увеличьте количество слотов в аукционе"
          />

          <MobileAppDialogExtraActions>
            <Button>Here</Button>
          </MobileAppDialogExtraActions>
        </MobileAppDialogHeader>

        <div className="w-full h-full overflow-scroll">
          <ControlledCreateSlotForm
            multiplySlots={multiplySlots}
            form={form}
          />
        </div>

        <MobileAppDialogFooter className="gap-x-4" direction="row">
          <Button
            className={sheetStyles.submitButton}
            variant="action"
            disabled={isShouldDisableSubmit}
            startContent={<Icons.Plus size="lg" />}
            onClick={handleFormSubmit}
          >
            Добавить
          </Button>
          <Button
            className={sheetStyles.resetButton}
            disabled={isLoading}
            onClick={resetAndCloseDialog}
          >
            Отмена
          </Button>
        </MobileAppDialogFooter>

      </MobileAppDialogContent>
    </MobileAppDialog>
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
