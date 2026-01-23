import type { ReactNode } from 'react'

import { FormProvider, useFormContext } from 'react-hook-form'

import { DesktopAppDialog, MobileAppDialog } from '~shared/components/app-dialog'

import { DeleteSlotButton } from '~features/auction-slot/delete-slot/ui'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { SlotPointsFormInput, SlotTitleFormInput } from '~entities/auction-slot/ui/form'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import type { ButtonProps } from '~shared/ui/button'
import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import type {
  SheetProps,
} from '~shared/ui/sheet'
import {
  SheetClose,
} from '~shared/ui/sheet'

import { mergeProps } from '~shared/utils'

import { useEditSlotDialog } from '../hooks'
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

  const isDismissible = !formState.isDirty || formQueryState.isLoading

  const mergedSheetProps = mergeProps({
    open: dialogState.isOpen,
    onOpenChange: dialogState.setIsOpen,
    dismissible: isDismissible,
  }, restProps)

  if (isMediaLargeThenTablet) {
    return (
      <DesktopAppDialog {...mergedSheetProps}>
        {trigger && <DesktopAppDialog.Trigger>{ trigger }</DesktopAppDialog.Trigger>}
        <DesktopAppDialog.Content>

          <DesktopAppDialog.Header>
            <DesktopAppDialog.TopPanel>

              <DesktopAppDialog.HeaderActionsPanel>
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
              </DesktopAppDialog.HeaderActionsPanel>

              <DesktopAppDialog.HeaderActionsPanel>
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
                <DesktopAppDialog.CloseButton />
              </DesktopAppDialog.HeaderActionsPanel>
            </DesktopAppDialog.TopPanel>

            <DesktopAppDialog.Title
              icon={<EditSlotDialogsIcon />}
              title="Обзор слота"
              description="Измените параметры слота"
            />

          </DesktopAppDialog.Header>

          <FormProvider {...form}>
            <EditSlotForm />
          </FormProvider>

        </DesktopAppDialog.Content>
      </DesktopAppDialog>
    )
  }

  return (
    <MobileAppDialog {...mergedSheetProps}>
      <MobileAppDialog.Trigger>{ trigger }</MobileAppDialog.Trigger>

      <MobileAppDialog.Content>
        <MobileAppDialog.Header>
          <MobileAppDialog.HeaderTitle
            value="Обзор слота"
            description="Измените параметры слота"
            icon={<EditSlotDialogsIcon />}
          />
        </MobileAppDialog.Header>

        <FormProvider {...form}>
          <EditSlotForm />
        </FormProvider>

        <MobileAppDialog.Footer className="gap-x-4" direction="row">
          <Button
            className="w-full"
            variant="action"
            type="submit"
            disabled={formQueryState.isLoading || !formState.isDirty}
            startContent={<Icons.Save width={14} height={14} />}
            onClick={submit}
          >
            Сохранить
          </Button>
          <SheetClose
            className="relative top-0 right-0"
            render={(
              <Button
                className="w-full"
                icon={<Icons.LargeCross width={14} height={14} />}
                onClick={closeDialog}
                {...closeButtonProps}
              >
                Отмена
              </Button>
            )}
          />
        </MobileAppDialog.Footer>

      </MobileAppDialog.Content>
    </MobileAppDialog>
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
