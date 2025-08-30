import type { AxiosError } from 'axios'

import type { ProcessDonation } from '../model'

import { useForm, useFormState } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'

import type { Auction } from '~entities/auction/model'

import type { ProcessedDonation } from '~entities/donation/model'

import { useProcessDonationMutation } from '../api/process-donation.api'
import { processDonationSchema } from '../model'

export type UseProcessDonationFormArgs = {
  donation: ProcessedDonation
  auctionUUID: Auction['auctionUUID']
  onSuccess?: () => void
  onError?: (error: AxiosError) => void
}

export const useProcessDonationForm = (args: UseProcessDonationFormArgs) => {
  const form = useForm<ProcessDonation>({
    defaultValues: args.donation.processData,
    resolver: zodResolver(processDonationSchema),
  })

  const state = useFormState({ control: form.control })

  const [processDonationMutation, mutationState] = useProcessDonationMutation()

  const submitForm = async (formData: ProcessDonation) => {
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
