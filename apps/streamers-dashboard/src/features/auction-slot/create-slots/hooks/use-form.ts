import type { TransformedCreateSlotsFormData } from '../lib'
import type { CreateSlotForm } from '../model'

import { useForm, useFormState } from 'react-hook-form'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'
import { auctionSelectors } from '~entities/auction/store'

import type { AxiosBaseQueryError } from '~shared/lib/redux-toolkit'
import { useStoreSelector } from '~shared/lib/redux-toolkit'
import {
  toastErrorNotification,
  toastSuccessNotification,
} from '~shared/ui/toaster/lib'

import { useCreateSlotsMutation } from '../api'
import { CREATE_SLOT_FORM_DEFAULT_VALUE } from '../constants'
import { createSlotsFormResolver } from '../lib'

type UseCreateSlotsFormListeners = {
  onSuccess?: (formData: TransformedCreateSlotsFormData) => void
  onError?: (error: NullablePossible<AxiosBaseQueryError>) => void
}

const useCreateSlotsForm = (listeners?: UseCreateSlotsFormListeners) => {
  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const form = useForm<
        CreateSlotForm,
        unknown,
        TransformedCreateSlotsFormData
    >({
    defaultValues: { slots: [CREATE_SLOT_FORM_DEFAULT_VALUE] },
    resolver: createSlotsFormResolver(auctionSlots),
    reValidateMode: 'onChange',
    shouldFocusError: true,
  })

  const state = useFormState({ control: form.control })

  const [createSlotsMutation, queryState] = useCreateSlotsMutation()

  const submitForm = async (formData: TransformedCreateSlotsFormData) => {
    const response = await createSlotsMutation({
      auctionUUID,
      slots: formData.slots,
    })

    if (response.error) {
      const error = response.error as AxiosBaseQueryError

      toastErrorNotification(
        'Не удалось добавить слот(-ы)',
        error.reason || error.message,
        { position: 'bottom-left' },
      )
      listeners?.onError && listeners.onError(error)
    }

    toastSuccessNotification('Слот успешно добавлен в аукцион!')
    listeners?.onSuccess && listeners.onSuccess(formData)
  }

  return { form, state, submitForm, ...queryState }
}

export { useCreateSlotsForm }
