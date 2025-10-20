import type { AxiosError } from 'axios'

import type { ProcessDonationForm } from '../model'

import { useForm, useFormState } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'

import type { Auction } from '~entities/auction/model'

import type { ProcessedDonation } from '~entities/donation/model'

import { useProcessDonationMutation } from '../api/process-donation.api'
import { processDonationFormSchema } from '../model'

export type UseProcessDonationFormArgs = {
  donation: ProcessedDonation
  auctionUUID: Auction['auctionUUID']
  defaultFormValues?: ProcessDonationForm
  onSuccess?: () => void
  onError?: (error: AxiosError) => void
}

const formDefaultValue: ProcessDonationForm = {
  donationId: -1,
  title: '',
  points: 0,
}

export const useProcessDonationForm = (args: UseProcessDonationFormArgs) => {
  const form = useForm<ProcessDonationForm>({
    defaultValues: {
      ...args.defaultFormValues ?? formDefaultValue,
      title: args.defaultFormValues?.title || formDefaultValue.title,
      points: args.defaultFormValues?.points?.toString() || formDefaultValue.points.toString(),
    },
    resolver: zodResolver(processDonationFormSchema),
  })

  const state = useFormState({ control: form.control })

  const [processDonationMutation, mutationState] = useProcessDonationMutation()

  const submitForm = async (formData: ProcessDonationForm) => {
    const response = await processDonationMutation({
      auctionUUID: args.auctionUUID,
      id: args.donation.id,
      ...formData,
    })

    if (response.error) {
      if (isAxiosError(response.error))
        return args.onError && args.onError(response.error)

      args.onSuccess && args.onSuccess()
    }
  }

  return { form, state, submitForm, queryState: mutationState }
}
