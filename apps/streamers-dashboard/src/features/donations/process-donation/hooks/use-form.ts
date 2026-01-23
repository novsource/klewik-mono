import type { AxiosError } from 'axios'

import type { TransformedProcessDonationFormData } from '../lib'
import type { ProcessDonationForm } from '../model'

import { useForm, useFormState } from 'react-hook-form'

import { isAxiosError } from 'axios'

import type { Auction } from '~entities/auction/model'

import type { ProcessedDonation } from '~entities/donation/model'

import { formatNumberToIntlString } from '~shared/utils'

import { useProcessDonationMutation } from '../api/process-donation.api'
import { processDonationFormResolver } from '../lib'

export type UseProcessDonationFormArgs = {
  donation: ProcessedDonation
  auctionUUID: Auction['auctionUUID']
  defaultFormValues?: TransformedProcessDonationFormData
  onSuccess?: () => void
  onError?: (error: AxiosError) => void
}

const formDefaultValue: TransformedProcessDonationFormData = {
  title: '',
  points: 0,
}

export const useProcessDonationForm = (args: UseProcessDonationFormArgs) => {
  const form = useForm<ProcessDonationForm, unknown, TransformedProcessDonationFormData>({
    defaultValues: {
      ...args.defaultFormValues ?? formDefaultValue,
      title: args.defaultFormValues?.title || formDefaultValue.title,
      points: formatNumberToIntlString(args.defaultFormValues?.points || formDefaultValue.points),
    },
    resolver: processDonationFormResolver,
  })

  const state = useFormState({ control: form.control })

  const [processDonationMutation, mutationState] = useProcessDonationMutation()

  const submitForm = async (formData: TransformedProcessDonationFormData) => {
    const response = await processDonationMutation({
      auctionUUID: args.auctionUUID,
      id: args.donation.id,
      ...formData,
    })

    if (response.error) {
      if (isAxiosError(response.error))
        return args.onError && args.onError(response.error)

      args.onSuccess?.()
    }
  }

  return { form, state, submitForm, queryState: mutationState }
}
