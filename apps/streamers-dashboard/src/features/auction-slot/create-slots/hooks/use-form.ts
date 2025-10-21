import type { TransformedCreateSlotsFormData } from '../lib'
import type { CreateSlotForm } from '../model'

import { useForm, useFormState } from 'react-hook-form'

import { auctionSelectors } from '~entities/auction/store'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import type { AxiosBaseQueryError } from '~shared/lib/redux-toolkit'
import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { useCreateSlotsMutation } from '../api'
import { CREATE_SLOT_FORM_DEFAULT_VALUE } from '../constants'
import { createSlotsFormResolver } from '../lib'

type UseCreateSlotsFormListeners = {
  onSuccess?: (createdSlots: AuctionSlot[]) => void
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

      listeners?.onError && listeners.onError(error)
    }
    else {
      listeners?.onSuccess && listeners.onSuccess(response.data)
    }
  }

  return { form, state, submitForm, ...queryState }
}

export { useCreateSlotsForm }
