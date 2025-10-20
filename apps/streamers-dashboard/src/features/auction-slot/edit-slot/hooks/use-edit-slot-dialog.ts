import { useCallback, useState } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions } from '~entities/auction-slot/store'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import { closeAllToasts, toastErrorNotification, toastSuccessNotification } from '~shared/ui/toaster/lib'

import { useEditSlotForm } from './use-form'

export const useEditSlotDialog = (target: AuctionSlot) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { updateSlot } = useActionCreators(auctionSlotsActions)

  const { form, formState, submitForm, ...formQueryState } = useEditSlotForm(target, {
    onSuccess: (slot) => {
      updateSlot({ id: target.id, data: slot })
      setIsSuccess(true)
    },
    onError: (error) => {
      toastErrorNotification('Не удалось изменить слот', error.reason)
    },
  })

  if (!isOpen && formState.isDirty) {
    form.reset()
    form.clearErrors()

    closeAllToasts()

    if (isSuccess) {
      toastSuccessNotification('Слот успешно изменен!')
    }
  }

  const submit = useCallback(() => {
    const submit = form.handleSubmit(submitForm)

    return submit()
  }, [form, submitForm])

  return {
    dialogState: { isSuccess, isOpen, setIsOpen },
    form,
    formState,
    queryState: formQueryState,
    submit,
  }
}
