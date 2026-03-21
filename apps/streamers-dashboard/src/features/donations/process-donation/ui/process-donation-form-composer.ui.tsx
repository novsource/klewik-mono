import type { SerializedError } from '@reduxjs/toolkit'

import type { TransformedProcessDonationFormData } from '../lib'
import type { ProcessDonationForm } from '../model'

import { useMemo, useState } from 'react'
import type { ComponentPropsWithoutRef, KeyboardEvent, MouseEvent, ReactNode } from 'react'

import type { UseFormReturn } from 'react-hook-form'
import { FormProvider, useController, useFormContext, useFormState } from 'react-hook-form'

import { auctionSelectors } from '~entities/auction/store'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { SlotPointsFormInput } from '~entities/auction-slot/ui/form'

import type { ProcessedDonation } from '~entities/donation/model'
import { donationsActions } from '~entities/donation/store'

import { Text } from '~shared/components/typography'

import { getErrorMessageForField } from '~shared/lib/react-hook-form'
import type { AxiosBaseQueryError } from '~shared/lib/redux-toolkit'
import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Autocomplete, AutocompleteContent, AutocompleteInput, AutocompleteItem } from 'klewik-ui/autocomplete'
import type { AutocompleteInputProps, AutocompleteProps, AutocompleteTag } from 'klewik-ui/autocomplete'
import type { ButtonProps } from 'klewik-ui/button'
import { Button } from 'klewik-ui/button'
import { Icons } from 'klewik-ui/icons'
import type { InputProps } from 'klewik-ui/input'
import { toastErrorNotification } from 'klewik-ui/toaster/lib'
import { mergeProps } from 'klewik-ui/utils'

import { cn, deleteAllSpacesFromString, isFunction } from '~shared/utils'

import { useApproveDonationMutation, useDeclineDonationMutation, useUpdateDonationInfoMutation } from '../api'
import { PROCESS_DONATION_FORM_ID } from '../constants'
import { useProcessDonationContext } from '../context'

export type ProcessDonationFormComposerProps = ComponentPropsWithoutRef<'form'> & {
  form: UseFormReturn<ProcessDonationForm, unknown, TransformedProcessDonationFormData>
}

export const ProcessDonationFormComposer = (props: ProcessDonationFormComposerProps) => {
  const { form, ...restProps } = props

  return (
    <FormProvider {...form}>
      <form {...restProps} />
    </FormProvider>
  )
}

ProcessDonationFormComposer.ApproveDonationButton = ApproveDonationButton
ProcessDonationFormComposer.RejectDonationButton = DeclineDonationButton
ProcessDonationFormComposer.SaveChangesButton = SaveDonationButton
ProcessDonationFormComposer.SlotTitleInput = ProcessedDonationSlotTitleFormInput
ProcessDonationFormComposer.SlotPointsInput = ProcessedDonationSlotPointsFormInput

type ApproveDonationButtonProps = Omit<ButtonProps, 'form'> & {
  form: UseFormReturn<ProcessDonationForm, unknown, TransformedProcessDonationFormData>
  donation: ProcessedDonation
  onSuccess?: (donation: ProcessedDonation) => void
  onError?: (error: AxiosBaseQueryError | SerializedError) => void
}

function ApproveDonationButton(props: ApproveDonationButtonProps) {
  const { form, donation, onSuccess, onError, ...restProps } = props

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)
  const state = useFormState(form)

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
      points: Number(deleteAllSpacesFromString(formData.points)),
    })

    if (response.error) {
      setIsBlockedActions(false)

      toastErrorNotification('Не удалось подтвердить донат', response.error.message)
      onError?.(response.error)

      return
    }

    const updatedDonation: ProcessedDonation = {
      ...donation,
      processData: { ...donation.processData, status: 'added' },
    }

    updateDonation(updatedDonation)
    onSuccess?.(updatedDonation)

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
  form: UseFormReturn<ProcessDonationForm, unknown, TransformedProcessDonationFormData>
  donation: ProcessedDonation
  onSuccess?: (donation: ProcessedDonation) => void
  onError?: (error: AxiosBaseQueryError | SerializedError) => void
}

function DeclineDonationButton(props: DeclineDonationButtonProps) {
  const { form, donation, onSuccess, onError, ...restProps } = props
  const {
    state: { isBlockedActions },
    dispatch: { setIsBlockedActions },
  } = useProcessDonationContext()

  const formState = useFormState(form)

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
      setIsBlockedActions(false)

      toastErrorNotification('Не удалось отклонить донат', response.error.message)
      onError?.(response.error)

      return
    }

    const updatedDonation: ProcessedDonation = {
      ...donation,
      processData: { ...donation.processData, status: 'rejected' },
    }

    updateDonation(updatedDonation)
    onSuccess?.(updatedDonation)

    setIsBlockedActions(false)
  }

  const handleOnClick = () => {
    declineDonation()
  }

  const isButtonDisabled
    = formState.isDirty
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
  form: UseFormReturn<ProcessDonationForm, unknown, TransformedProcessDonationFormData>
  donation: ProcessedDonation
  onSuccess?: (donation: ProcessedDonation) => void
  onError?: (error: AxiosBaseQueryError | SerializedError) => void
}

function SaveDonationButton(props: SaveDonationButtonProps) {
  const { form, donation, onSuccess, onError, ...restProps } = props

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)
  const { updateDonation } = useActionCreators(donationsActions)

  const formState = useFormState(form)

  const {
    state: { isBlockedActions },
    dispatch: { setIsBlockedActions },
  } = useProcessDonationContext()

  const [updateDonationInfoMutation, { isLoading }] = useUpdateDonationInfoMutation()

  const isButtonDisabled = !formState.isDirty || !formState.isValid || isBlockedActions || isLoading

  const saveDonationChanges = async () => {
    if (isLoading || isButtonDisabled)
      return

    setIsBlockedActions(true)

    const response = await updateDonationInfoMutation({
      auctionUUID,
      id: donation.id,
      title: donation.processData.title || '',
      points: donation.processData.addedPoints || donation.amount,
    })

    if (response.error) {
      setIsBlockedActions(false)

      toastErrorNotification('Не удалось сохранить донат', response.error.message)
      onError?.(response.error)

      return
    }

    updateDonation(donation)
    onSuccess?.(donation)

    setIsBlockedActions(false)
  }

  const mergedProps = mergeProps(restProps, {
    variant: 'action',
    startContent: <Icons.Save width={14} height={14} />,
    onClick: saveDonationChanges,
  })

  return (
    <Button
      {...mergedProps}
      className="h-8"
      size="sm"
      disabled={isButtonDisabled}
    >
      Сохранить
    </Button>
  )
}

const preventEnterFn = (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.which === 13 /* Enter */) {
    event.preventDefault()
  }
}

const convertAuctionSlotItemsToTags = (items: AuctionSlot[]) => {
  return items.map<AutocompleteTag>(item => ({
    id: item.id.toString(),
    value: item.title,
  }))
}

export type ProcessedDonationSlotTitleFormInputProps = Omit<AutocompleteProps, 'items'> & {
  children?: (tag: AutocompleteTag) => ReactNode
  inputProps?: AutocompleteInputProps
  auctionSlots?: AuctionSlot[]
  maxLength?: number
}

function ProcessedDonationSlotTitleFormInput(props: ProcessedDonationSlotTitleFormInputProps) {
  const {
    auctionSlots: items,
    children,
    inputProps,
    maxLength = 35,
    ...restProps
  } = props

  const [isFocused, setIsFocused] = useState(false)
  const [boundAnimationStatus, setBoundAnimationStatus] = useState<
    'inactive' | 'active'
  >('inactive')

  const { formState, control, trigger } = useFormContext<ProcessDonationForm>()

  const {
    field: { onChange: fieldOnChange, value: fieldValue, ...field },
  } = useController({ control, name: 'title' })

  const errorMessage = getErrorMessageForField(formState, 'title')

  const handleOnChange = (inputValue: string) => {
    if (inputValue.length > maxLength) {
      fieldOnChange(inputValue.slice(0, maxLength))
      setBoundAnimationStatus('active')
    }
    else {
      fieldOnChange(inputValue)
      setBoundAnimationStatus('inactive')
    }

    trigger()
  }

  const autocompleteTags = useMemo(
    () => convertAuctionSlotItemsToTags(items ?? []),
    [items],
  )

  const inputHandlers: InputProps = {
    onChange: event => handleOnChange(event.target.value),
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    onKeyDown: preventEnterFn,
  }

  const mergedInputProps = mergeProps(inputHandlers, inputProps)

  return (
    <Autocomplete
      items={autocompleteTags}
      onValueChange={value => handleOnChange(value)}
      value={fieldValue}
      {...restProps}
    >
      <AutocompleteInput
        variant="ghost"
        placeholder="Итоговое название слота"
        slotClassNames={{
          base: 'w-full basis-1/2 grow',
          wrapper: !isFocused && 'pl-0.5',
          description: 'text-wrap',
        }}
        errorMessage={errorMessage}
        endContent={
          isFocused
            ? (
              <Text
                asSpan
                className={cn(
                  'text-md transition-colors select-none',
                  boundAnimationStatus === 'active'
                    ? 'animate-horizontal-shaking text-red'
                    : 'text-gray-light',
                )}
                onAnimationEnd={() => {
                  setBoundAnimationStatus('inactive')
                }}
              >
                {`${fieldValue.toString().length}/${maxLength}`}
              </Text>
            )
            : undefined
        }
        {...field}
        {...mergedInputProps}
      />
      <AutocompleteContent showEmpty={false}>
        {(tag) => {
          if (isFunction(children))
            return children(tag)

          return (
            <AutocompleteItem tag={tag} key={tag.id}>
              {tag.value}
            </AutocompleteItem>
          )
        }}
      </AutocompleteContent>
    </Autocomplete>
  )
}

export type ProcessedDonationSlotPointsFormInputProps = {
  children?: (tag: AutocompleteTag) => ReactNode
  inputProps?: AutocompleteInputProps
}

function ProcessedDonationSlotPointsFormInput(props: ProcessedDonationSlotPointsFormInputProps) {
  const {
    children,
    inputProps,
    ...restProps
  } = props

  const { formState, control, trigger } = useFormContext<ProcessDonationForm>()

  const errorMessage = getErrorMessageForField(formState, 'points')

  return (
    <SlotPointsFormInput
      control={control}
      name="points"
      showPercentInput={false}
      pointsInputProps={{
        variant: 'ghost',
        label: undefined,
        startContent: undefined,
        slotClassNames: { input: 'text-right text-white/80' },
        errorMessage,
        isAllowed: value =>
          value?.floatValue ? value.floatValue <= 1_000_000 : true,
        onChange: () => {
          trigger()
        },
      }}
      {...restProps}
    />
  )
}
