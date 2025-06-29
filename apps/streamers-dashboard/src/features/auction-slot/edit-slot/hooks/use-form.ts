import type { TransformedEditSlotFormData } from '../lib'
import type { EditSlotFormData } from '../model'

import { useForm, useFormState } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSelectors } from '~entities/auction/store'

import type { AxiosBaseQueryError } from '~shared/lib/redux-toolkit'
import { useStoreSelector } from '~shared/lib/redux-toolkit'
import { formatNumberToIntlString } from '~shared/utils'

import { useEditSlotMutation } from '../api'
import { transformEditSlotFormData } from '../lib'

type UseEditSlotFormOptions = {
  defaultValues?: Pick<AuctionSlot, 'title' | 'points'>
  onSuccess?: (formData: TransformedEditSlotFormData) => void
  onError?: (error: AxiosBaseQueryError) => void
}

const useEditSlotForm = (target: AuctionSlot, { defaultValues, onError, onSuccess }: UseEditSlotFormOptions) => {
  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const form = useForm<
    EditSlotFormData,
    unknown,
    TransformedEditSlotFormData
  >({
    defaultValues: {
      title: defaultValues?.title ?? target.title,
      points: formatNumberToIntlString(defaultValues?.points ?? target.points),
    },
    resolver: zodResolver(transformEditSlotFormData()),
    mode: 'all',
    reValidateMode: 'onChange',
  })

  const formState = useFormState({ control: form.control })

  const [editSlotMutation, queryState] = useEditSlotMutation()

  const submitForm = async (formData: TransformedEditSlotFormData) => {
    const response = await editSlotMutation({
      auctionUUID,
      slot: { id: target.id, ...formData },
    })

    if (response.error) {
      const error = response.error as AxiosBaseQueryError

      return onError && onError(error)
    }

    onSuccess && onSuccess(formData)
  }

  return { form, formState, submitForm, ...queryState }
}

export { useEditSlotForm }
