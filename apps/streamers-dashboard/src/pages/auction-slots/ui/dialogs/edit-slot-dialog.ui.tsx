import type { MouseEvent, ReactNode } from 'react'

import { useEditSlotDialog } from '~pages/auction-slots/hooks/use-edit-slot-dialog'

import { DeleteSlotButton } from '~features/auction-slot/delete-slot/ui'
import { EditSlotFormComposer } from '~features/auction-slot/edit-slot/ui'

import type { AuctionSlot } from '~entities/auction-slot/model'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { DesktopAppDialog, MobileAppDialog } from '~shared/components/app-dialog'
import { MediaQueryViewToggler } from '~shared/components/media-query-view-toggler'
import { Modal, ModalContent, ModalTrigger } from '~shared/components/modal'

import type { ButtonProps } from '~shared/ui/button'
import { Button } from '~shared/ui/button'
import type { DialogProps } from '~shared/ui/dialog'
import { Divider } from '~shared/ui/divider'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import type {
  SheetProps,
} from '~shared/ui/sheet'
import {
  SheetClose,
} from '~shared/ui/sheet'

import { mergeProps } from '~shared/utils'

import { EditSlotDialogCard } from '../cards/edit-slot-dialog-card.ui'

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

  const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    submit()
  }

  const closeDialog = () => {
    if (formQueryState.isLoading)
      return

    dialogState.setIsOpen(false)
    form.reset()
  }

  const isDismissible = !formState.isDirty || formQueryState.isLoading

  const mergedSheetProps = mergeProps<DialogProps[]>({
    open: dialogState.isOpen,
    onOpenChange: dialogState.setIsOpen,
    disablePointerDismissal: !isDismissible,
  }, restProps)

  return (
    <MediaQueryViewToggler query={greaterThenDeviceWidthMediaQueries.tablet}>

      <MediaQueryViewToggler.MatchedItem>
        <DesktopAppDialog {...mergedSheetProps}>
          {trigger && <DesktopAppDialog.Trigger>{ trigger }</DesktopAppDialog.Trigger>}
          <DesktopAppDialog.Content>

            <EditSlotFormComposer form={form}>

              <DesktopAppDialog.Header className="mb-4">
                <DesktopAppDialog.TopPanel>

                  <DesktopAppDialog.HeaderActionsPanel>
                    <DeleteSlotButton
                      slotId={inputSlot.id}
                      className="size-8"
                      variant="error"
                      disabled={formQueryState.isLoading}
                      isIconOnly
                      icon={<Icons.Bin size="xs" />}
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
                    <EditSlotFormComposer.SubmitButton
                      className="h-full"
                      size="sm"
                      startContent={<Icons.Save width={14} height={14} />}
                      onClick={handleSubmit}
                    />

                    <Divider className="mx-1" />

                    <DesktopAppDialog.CloseButton />
                  </DesktopAppDialog.HeaderActionsPanel>
                </DesktopAppDialog.TopPanel>

                <DesktopAppDialog.Title
                  icon={<EditSlotDialogsIcon />}
                  title="Обзор слота"
                  description="Измените параметры слота"
                />

              </DesktopAppDialog.Header>

              <Flex className="flex-col h-full gap-y-2">
                <EditSlotDialogCard
                  className="pt-3 pb-1"
                  contentPosition="bottom"
                  title="Слот"
                  titleIcon={<Icons.Slots className="text-gray" size="xs" />}
                >
                  <EditSlotFormComposer.TitleFieldInput variant="ghost" />
                </EditSlotDialogCard>

                <EditSlotDialogCard
                  className="py-2"
                  contentPosition="right"
                  title="Очки"
                  titleIcon={<Icons.Coin className="text-gray" size="sm" />}
                >
                  <EditSlotFormComposer.PointsFieldInput variant="ghost" />
                </EditSlotDialogCard>
              </Flex>

            </EditSlotFormComposer>

          </DesktopAppDialog.Content>
        </DesktopAppDialog>

      </MediaQueryViewToggler.MatchedItem>

      <MediaQueryViewToggler.NotMatchedItem>
        <MobileAppDialog {...mergedSheetProps}>
          <MobileAppDialog.Trigger>{ trigger }</MobileAppDialog.Trigger>

          <MobileAppDialog.Content>

            <EditSlotFormComposer form={form} className="flex flex-col h-full justify-between">

              <MobileAppDialog.Header className="flex-col gap-y-5 items-start px-0">
                <Flex className="w-full gap-x-2" justify="between" align="center">
                  <MobileAppDialog.ExtraActionsDialog>
                    <Flex className="gap-y-2" direction="column">
                      <Button startContent={<Icons.Reset />}>Сбросить изменения</Button>

                      <Modal>
                        <ModalTrigger render={<Button variant="error">Удалить</Button>} />
                        <ModalContent backdropProps={{ forceRender: true }}>
                          fdsf
                        </ModalContent>
                      </Modal>

                    </Flex>

                  </MobileAppDialog.ExtraActionsDialog>
                  <SheetClose
                    render={(
                      <Button
                        variant="ghost"
                        isIconOnly
                        icon={<Icons.LargeCross />}
                        size="xs"
                        onClick={closeDialog}
                      />
                    )}
                  />
                </Flex>

                <MobileAppDialog.HeaderTitle
                  value="Обзор слота"
                  description="Измените параметры слота"
                  icon={<EditSlotDialogsIcon />}
                />
              </MobileAppDialog.Header>

              <Flex className="flex flex-col gap-y-2 grow">
                <EditSlotDialogCard
                  className="pt-3 pb-1"
                  contentPosition="bottom"
                  title="Слот"
                  titleIcon={<Icons.Slots className="text-gray" size="xs" />}
                >
                  <EditSlotFormComposer.TitleFieldInput variant="ghost" />
                </EditSlotDialogCard>

                <EditSlotDialogCard
                  className="py-2"
                  contentPosition="right"
                  title="Очки"
                  titleIcon={<Icons.Coin className="text-gray" size="sm" />}
                >
                  <EditSlotFormComposer.PointsFieldInput variant="ghost" />
                </EditSlotDialogCard>
              </Flex>

              <MobileAppDialog.Footer className="gap-x-3" direction="row">
                <SheetClose
                  className="relative top-0 right-0"
                  render={(
                    <Button
                      className="w-fit"
                      icon={<Icons.LargeCross width={14} height={14} />}
                      onClick={closeDialog}
                      {...closeButtonProps}
                    >
                      Отмена
                    </Button>
                  )}
                />
                <EditSlotFormComposer.SubmitButton
                  className="w-full h-full"
                  startContent={<Icons.Save width={14} height={14} />}
                  onClick={handleSubmit}
                />
              </MobileAppDialog.Footer>

            </EditSlotFormComposer>

          </MobileAppDialog.Content>
        </MobileAppDialog>

      </MediaQueryViewToggler.NotMatchedItem>
    </MediaQueryViewToggler>
  )
}

function EditSlotDialogsIcon() {
  return (
    <div className="bg-[#FFC837]/50 h-fit w-fit rounded-small p-0.25 outline-4 outline-[#FFC837]/15">
      <Flex
        className="relative size-8 tablet:size-9 rounded-small p-1.25"
        align="center"
        justify="center"
      >
        <Icons.Pencil gradient />
      </Flex>
    </div>
  )
}
