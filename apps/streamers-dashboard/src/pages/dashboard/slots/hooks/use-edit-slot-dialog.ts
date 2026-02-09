import { useCallback, useState } from 'react'

import { useEditSlotForm } from '~features/auction-slot/edit-slot/hooks'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions } from '~entities/auction-slot/store'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import { closeAllToasts, toastErrorNotification, toastSuccessNotification } from '~shared/ui/toaster/lib'

export const useEditSlotDialog = (target: AuctionSlot) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { updateSlot } = useActionCreators(auctionSlotsActions)

  const { form, formState, submitForm, ...formQueryState } = useEditSlotForm(target, {
    onSuccess: (slot) => {
      updateSlot({ id: target.id, data: slot })
      setIsSuccess(true)

      closeAllToasts()
      toastSuccessNotification('Слот успешно изменен!')
    },
    onError: (error) => {
      toastErrorNotification('Не удалось изменить слот', error.reason)
    },
  })

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
