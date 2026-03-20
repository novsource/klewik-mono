import type { TransformedEditSlotFormData } from '../lib'
import type { EditSlotFormData } from '../model'

import { useEffect } from 'react'

import { useForm, useFormState } from 'react-hook-form'

import { auctionSelectors } from '~entities/auction/store'

import type { AuctionSlot } from '~entities/auction-slot/model'

import type { AxiosBaseQueryError } from '~shared/lib/redux-toolkit'
import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { formatNumberToIntlString } from '~shared/utils'

import { useEditSlotMutation } from '../api'
import { editSlotFormResolver } from '../lib/form-resolver'

export type UseEditSlotFormOptions = {
  onSuccess?: (formData: TransformedEditSlotFormData) => void
  onError?: (error: AxiosBaseQueryError) => void
}

export const useEditSlotForm = (target: AuctionSlot, options: UseEditSlotFormOptions) => {
  const { onError, onSuccess } = options

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const form = useForm<
    EditSlotFormData,
    unknown,
    TransformedEditSlotFormData
  >({
    defaultValues: {
      title: target.title,
      points: formatNumberToIntlString(target.points),
    },
    resolver: (values, _, options) => editSlotFormResolver(values, options),
  })

  useEffect(() => {
    if (target) {
      form.reset(
        {
          title: target.title,
          points: formatNumberToIntlString(target.points),
        },
      )
    }
  }, [target, form])

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
