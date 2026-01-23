import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'

import { globalDialogsActions } from '~features/_common/display-dialogs'

import { useProcessDonationForm } from '~features/donations/process-donation/hooks'

import { auctionSelectors } from '~entities/auction/store'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import type { ProcessedDonation } from '~entities/donation/model'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { DesktopAppDialog, MobileAppDialog } from '~shared/components/app-dialog'
import { MediaQueryViewToggler } from '~shared/components/media-query-view-toggler'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import type { DialogProps } from '~shared/ui/dialog'
import { Divider } from '~shared/ui/divider'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import type {
  SheetProps,
} from '~shared/ui/sheet'

import { formatNumberToIntlString, mergeProps, twSlotsStyles } from '~shared/utils'

import { ProcessDonationContextProvider, useProcessDonationContext } from '../context'
import { processDonationDialogStyles } from '../styles'
import { ProcessDonationDialogTabs } from './dialog-tabs.ui'
import { ProcessDonationFormComposer } from './form-composer.ui'

export type ProcessDonationDialogProps = SheetProps & {
  donation: ProcessedDonation
  trigger?: ReactNode
}

export const ProcessDonationDialog = (props: ProcessDonationDialogProps) => {
  const { donation, trigger, ...restProps } = props

  return (
    <ProcessDonationContextProvider donation={donation}>
      <ProcessDonationDialogBase donation={donation} trigger={trigger} {...restProps} />
    </ProcessDonationContextProvider>
  )
}

type ProcessDonationDialogBaseProps = SheetProps & {
  donation: ProcessedDonation
  trigger?: ReactNode
}

function ProcessDonationDialogBase(props: ProcessDonationDialogBaseProps) {
  const { donation, trigger, ...restProps } = props

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)
  const storedSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const { setDialogOpenStatus, setDialogState } = useActionCreators(globalDialogsActions)

  const [isDialogOpened, setIsDialogOpened] = useState(false)

  const { state: { donationCode }, dispatch: { setDonationCode } } = useProcessDonationContext()

  const formSlotTitle = useMemo(() => {
    const existedSlotByDonationCodeId = storedSlots.find(slot => slot.id === donationCode?.slotId)

    if (!existedSlotByDonationCodeId) {
      return donationCode?.title ?? ''
    }

    return existedSlotByDonationCodeId.title
  }, [storedSlots, donationCode])

  const { form, state, queryState } = useProcessDonationForm({
    auctionUUID,
    donation,
    defaultFormValues: {
      title: formSlotTitle ?? '',
      points: donation.processData.addedPoints || donation.amount,
    },
  })

  useEffect(() => {
    form.reset({
      points: formatNumberToIntlString(donation.processData.addedPoints || donation.amount),
      title: formSlotTitle,
    })
  }, [donation, form, formSlotTitle])

  const isFormDirty = state.isDirty

  const resetForm = () => {
    if (!isFormDirty)
      return

    form.reset()
  }

  const closeDialog = () => {
    if (queryState.isLoading)
      return

    form.reset()

    setIsDialogOpened(false)
    setDialogOpenStatus({ dialog: 'processDonation', status: false })
  }

  useEffect(() => {
    if (donationCode) {
      form.reset({
        title: donationCode.title,
        points: formatNumberToIntlString(donation.processData.addedPoints || 0),
      })
    }
  }, [donationCode, donation, form])

  const sheetStyles = useMemo(
    () => twSlotsStyles(processDonationDialogStyles),
    [],
  )
  const mergedDialogProps = mergeProps<DialogProps[]>({
    open: isDialogOpened,
    onOpenChange: setIsDialogOpened,
    disablePointerDismissal: state.isDirty || state.isLoading,
  }, restProps)

  return (
    <MediaQueryViewToggler query={greaterThenDeviceWidthMediaQueries.tablet}>

      <MediaQueryViewToggler.MatchedItem>
        <DesktopAppDialog {...mergedDialogProps}>
          <DesktopAppDialog.Trigger nativeButton={false}>
            {trigger}
          </DesktopAppDialog.Trigger>
          <DesktopAppDialog.Content>
            <Flex
              className={sheetStyles.contentWrapper}
              direction="column"
              align="center"
            >
              <DesktopAppDialog.Header>
                <DesktopAppDialog.TopPanel>
                  <DesktopAppDialog.HeaderActionsPanel className="w-full justify-between">

                    <Flex className="gap-x-2" align="center">
                      <Button
                        className={sheetStyles.resetButton}
                        isIconOnly
                        icon={<Icons.Reset size="xs" />}
                        disabled={!isFormDirty}
                        onClick={resetForm}
                      />

                      <Divider className="mx-1" orientation="vertical" />

                      <ProcessDonationFormComposer.ApproveDonationButton
                        form={form}
                        donation={donation}
                        onSuccess={(updatedDonation) => {
                          setDialogState({ dialog: 'processDonation', data: { initialData: updatedDonation, isOpen: true } })
                        }}
                      />
                      <ProcessDonationFormComposer.RejectDonationButton
                        form={form}
                        donation={donation}
                        onSuccess={(updatedDonation) => {
                          setDialogState({ dialog: 'processDonation', data: { initialData: updatedDonation, isOpen: true } })
                        }}
                      />
                    </Flex>

                    <Flex className={sheetStyles.panelActionsButtons} align="center">
                      <ProcessDonationFormComposer.SaveChangesButton
                        className={sheetStyles.submitButton}
                        form={form}
                        donation={donation}
                        onSuccess={(updatedDonation) => {
                          setDialogState({ dialog: 'processDonation', data: { initialData: updatedDonation, isOpen: true } })
                        }}
                      />

                      <Divider className="mx-1" orientation="vertical" />

                      <DesktopAppDialog.CloseButton
                        disabled={isFormDirty || queryState.isLoading}
                        onClick={closeDialog}
                      />

                    </Flex>
                  </DesktopAppDialog.HeaderActionsPanel>
                </DesktopAppDialog.TopPanel>

                <DesktopAppDialog.Title
                  icon={<ProcessDonationDialogIcon />}
                  title="Управление донатом"
                  description="Изменение статуса доната"
                />

              </DesktopAppDialog.Header>

              <ProcessDonationFormComposer className="w-full flex flex-col" form={form}>
                <ProcessDonationDialogTabs donation={donation} />
              </ProcessDonationFormComposer>

            </Flex>
          </DesktopAppDialog.Content>
        </DesktopAppDialog>

      </MediaQueryViewToggler.MatchedItem>

      <MediaQueryViewToggler.NotMatchedItem>
        <MobileAppDialog {...mergedDialogProps}>
          <MobileAppDialog.Trigger nativeButton={false}>
            {trigger}
          </MobileAppDialog.Trigger>

          <MobileAppDialog.Content>
            <MobileAppDialog.Header>
              <MobileAppDialog.HeaderTitle
                icon={<ProcessDonationDialogIcon />}
                value="Управление донатом"
              />

            </MobileAppDialog.Header>

            <ProcessDonationFormComposer className="w-full h-full flex flex-col" form={form}>
              <ProcessDonationDialogTabs donation={donation} />
            </ProcessDonationFormComposer>

            <MobileAppDialog.Footer className="flex-row gap-x-4 mt-6">
              <Button
                className={sheetStyles.resetButton}
                disabled={state.isLoading}
                onClick={closeDialog}
              >
                Отмена
              </Button>
              <ProcessDonationFormComposer.SaveChangesButton
                className={sheetStyles.submitButton}
                form={form}
                donation={donation}
                size="lg"
                onSuccess={(updatedDonation) => {
                  setDialogState({ dialog: 'processDonation', data: { initialData: updatedDonation, isOpen: true } })
                }}
              />
            </MobileAppDialog.Footer>
          </MobileAppDialog.Content>
        </MobileAppDialog>
      </MediaQueryViewToggler.NotMatchedItem>

    </MediaQueryViewToggler>
  )
}

function ProcessDonationDialogIcon() {
  return (
    <div className="w-fit h-fit bg-gradient-to-r bg-[#50C9C3]/60 p-0.5 rounded-small outline-4 outline-[#50C9C3]/20">
      <Flex
        className="relative size-8 tablet:size-9 rounded-small p-1.25"
        align="center"
        justify="center"
      >
        <Icons.MoneyHand gradient width={38} height={38} />
      </Flex>
    </div>
  )
}
