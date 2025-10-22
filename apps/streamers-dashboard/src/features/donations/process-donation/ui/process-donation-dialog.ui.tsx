import type { ProcessDonationForm } from '../model'

import type { MouseEvent, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'

import { FormProvider } from 'react-hook-form'

import { useProcessDonationForm } from '~features/donations/process-donation/hooks'

import { auctionSelectors } from '~entities/auction/store'

import type { ProcessedDonation } from '~entities/donation/model'
import { donationsActions } from '~entities/donation/store'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import type { ButtonProps } from '~shared/ui/button'
import { Button } from '~shared/ui/button'
import { Divider } from '~shared/ui/divider'
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

import { formatNumberToIntlString, mergeProps, twSlotsStyles } from '~shared/utils'

import { useApproveDonationMutation, useDeclineDonationMutation } from '../api'
import { PROCESS_DONATION_FORM_ID } from '../constants'
import { ProcessDonationContextProvider, useProcessDonationContext } from '../context'
import { processDonationDialogStyles } from '../styles'
import { ProcessDonationDialogTabs } from './dialog-tabs.ui'

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

  const [isSheetOpened, setIsSheetOpened] = useState(false)

  const { state: { donationCode } } = useProcessDonationContext()

  const { form, state, queryState } = useProcessDonationForm({
    auctionUUID,
    donation,
    defaultFormValues: {
      title: donationCode?.title ?? '',
      donationId: donation.id,
      points: donation.processData.addedPoints || 0,
    },
  })

  const sheetStyles = useMemo(
    () => twSlotsStyles(processDonationDialogStyles),
    [],
  )

  const isLargeThenTablet = useMediaQuery(
    greaterThenDeviceWidthMediaQueries.tablet,
  )

  const sheetContentSide = isLargeThenTablet ? 'right' : 'bottom'
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
    setIsSheetOpened(false)
  }

  useEffect(() => {
    if (donationCode) {
      form.reset({
        title: donationCode.title,
        points: formatNumberToIntlString(donation.processData.addedPoints || 0),
      })
    }
  }, [donationCode, donation, form])

  const mergedSheetProps = mergeProps({
    open: isSheetOpened,
    onOpenChange: setIsSheetOpened,
  }, restProps)

  return (
    <Sheet dismissible={!isFormDirty} {...mergedSheetProps}>
      <SheetTrigger
        nativeButton={false}
      >
        {trigger}
      </SheetTrigger>
      <SheetContent side={sheetContentSide} isFullPageSize={!isLargeThenTablet}>
        <Flex
          className={sheetStyles.contentWrapper}
          direction="column"
          align="center"
        >
          <SheetHeader className={sheetStyles.header}>
            {isLargeThenTablet
              && (
                <Flex className={sheetStyles.headerPanelWrapper} justify="between">
                  <Flex className="gap-x-2" align="center">
                    <Button
                      className={sheetStyles.resetButton}
                      isIconOnly
                      icon={<Icons.Reset size="xs" />}
                      disabled={!isFormDirty}
                      onClick={resetForm}
                    />
                    <Divider className="mx-1" orientation="vertical" />
                    <ApproveDonationButton form={form} state={state} donation={donation} />
                    <DeclineDonationButton form={form} state={state} donation={donation} />
                  </Flex>
                  <Flex className={sheetStyles.panelActionsButtons} align="center">
                    <SaveDonationButton
                      className={sheetStyles.submitButton}
                      form={form}
                      state={state}
                      donationId={donation.id}
                    />
                    <Divider className="mx-1" orientation="vertical" />
                    <SheetClose className="relative top-0 right-0">
                      <Button
                        className={sheetStyles.closeButton}
                        isIconOnly
                        icon={<Icons.LargeCross width={14} height={14} />}
                        disabled={isFormDirty || queryState.isLoading}
                        onClick={closeDialog}
                      />
                    </SheetClose>
                  </Flex>
                </Flex>
              )}
            <Flex
              className="w-full"
              direction="row"
              justify={isLargeThenTablet ? 'start' : 'between'}
            >
              <Flex className={sheetStyles.titleWrapper}>
                <ProcessDonationDialogIcon />
                <Flex direction="column" align="start">
                  <SheetTitle className={sheetStyles.title}>Управление пожертвованием</SheetTitle>
                  <SheetDescription>
                    <Typography className={sheetStyles.titleDescription} tag="p">
                      Измените статус пожертвования
                    </Typography>
                  </SheetDescription>
                </Flex>
              </Flex>
              {!isLargeThenTablet
                && (
                  <SheetClose className="relative top-0 right-0">
                    <Button
                      className={sheetStyles.closeButton}
                      isIconOnly
                      icon={<Icons.LargeCross width={14} height={14} />}
                      disabled={isFormDirty || queryState.isLoading}
                      onClick={closeDialog}
                    />
                  </SheetClose>
                )}
            </Flex>
          </SheetHeader>
          <FormProvider {...form}>
            <Flex className="w-full h-full" direction="column">
              <ProcessDonationDialogTabs donation={donation} />
            </Flex>
          </FormProvider>
        </Flex>
        {
          !isLargeThenTablet
          && (
            <Flex className={sheetStyles.footer} direction="column" justify="end">
              <Button
                className={sheetStyles.resetButton}
                startContent={<Icons.Reset size="xs" />}
                disabled={!isFormDirty}
                onClick={resetForm}
              >
                Сбросить
              </Button>
              <SaveDonationButton
                className={sheetStyles.submitButton}
                form={form}
                state={state}
                donationId={donation.id}
              />
            </Flex>
          )
        }
      </SheetContent>
    </Sheet>
  )
}

type ApproveDonationButtonProps = Omit<ButtonProps, 'form'> & {
  form: ReturnType<typeof useProcessDonationForm>['form']
  state: ReturnType<typeof useProcessDonationForm>['state']
  donation: ProcessedDonation
}

function ApproveDonationButton(props: ApproveDonationButtonProps) {
  const { form, state, donation, ...restProps } = props

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const { updateDonation } = useActionCreators(donationsActions)

  const {
    state: { isBlockedActions },
    dispatch: { setIsBlockedActions },
  } = useProcessDonationContext()

  const [approveDonationMutation, mutationState] = useApproveDonationMutation()

  const approveDonation = async (formData: ProcessDonationForm) => {
    if (mutationState.isLoading || donation.processData.status === 'added')
      return

    setIsBlockedActions(true)

    const response = await approveDonationMutation({
      auctionUUID,
      id: donation.id,
      title: formData.title,
      points: Number(formData.points),
    })

    if (response.error) {
      console.log(response.error)
    }
    else {
      updateDonation({
        id: donation.id,
        processData: { ...donation.processData, status: 'added' },
      })
    }

    setIsBlockedActions(false)
  }

  const isButtonDisabled
    = mutationState.isLoading
      || state.isDirty
      || isBlockedActions
      || donation.processData.status === 'added'

  const handleOnClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    approveDonation({
      donationId: donation.id,
      title: form.getValues().title,
      points: form.getValues().points,
    })
  }

  return (
    <Button
      className="size-8"
      variant="action"
      type="submit"
      form={PROCESS_DONATION_FORM_ID}
      isIconOnly
      icon={<Icons.Like width={14} height={14} />}
      disabled={isButtonDisabled}
      onClick={handleOnClick}
      {...restProps}
    />
  )
}

type DeclineDonationButtonProps = Omit<ButtonProps, 'form'> & {
  form: ReturnType<typeof useProcessDonationForm>['form']
  state: ReturnType<typeof useProcessDonationForm>['state']
  donation: ProcessedDonation
}

function DeclineDonationButton(props: DeclineDonationButtonProps) {
  const { form, state, donation, ...restProps } = props
  const {
    state: { isBlockedActions },
    dispatch: { setIsBlockedActions },
  } = useProcessDonationContext()

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const { updateDonation } = useActionCreators(donationsActions)

  const [declineDonationMutation, mutationState] = useDeclineDonationMutation()

  const declineDonation = async () => {
    if (mutationState.isLoading || donation.processData.status === 'rejected')
      return

    setIsBlockedActions(true)

    const response = await declineDonationMutation({
      auctionUUID,
      id: donation.id,
    })

    if (response.error) {
      console.log(response.error)
    }
    else {
      updateDonation({
        id: donation.id,
        processData: { ...donation.processData, status: 'rejected' },
      })
    }

    setIsBlockedActions(false)
  }

  const handleOnClick = () => {
    declineDonation()
  }

  const isButtonDisabled
    = state.isDirty
      || isBlockedActions
      || donation.processData.status === 'rejected'

  const mergedProps = mergeProps(restProps, {
    className: 'size-8',
    variant: 'error',
    icon: <Icons.Decline width={14} height={14} />,
    disabled: isButtonDisabled,
    onClick: handleOnClick,
  })

  return <Button isIconOnly {...mergedProps} />
}

type SaveDonationButtonProps = Omit<ButtonProps, 'form'> & {
  form: ReturnType<typeof useProcessDonationForm>['form']
  state: ReturnType<typeof useProcessDonationForm>['state']
  donationId: number
}

function SaveDonationButton(props: SaveDonationButtonProps) {
  const { form, state, ...restProps } = props

  const {
    state: { isBlockedActions },
  } = useProcessDonationContext()

  const isButtonDisabled = !state.isDirty || isBlockedActions

  const mergedProps = mergeProps(restProps, {
    size: 'sm',
    variant: 'action',
    startContent: <Icons.Save width={14} height={14} />,
  })

  return (
    <Button
      {...mergedProps}
      disabled={isButtonDisabled}
    >
      Сохранить
    </Button>
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
