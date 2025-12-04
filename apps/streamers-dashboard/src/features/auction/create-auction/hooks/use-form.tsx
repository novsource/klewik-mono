import type { CreateAuctionQueryReturnValue } from '../api'
import type { CreateAuctionFormData } from '../model'

import type { SubmitHandler } from 'react-hook-form'
import { useForm, useFormState } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import type { AxiosBaseQueryError } from '~shared/lib/redux-toolkit'

import { useCreateAuctionMutation } from '../api'
import { CreateAuctionSchema } from '../model'

export type UseCreateAuctionFormListeners = {
  onError?: (error: AxiosBaseQueryError) => void
  onSuccess?: (response: CreateAuctionQueryReturnValue & CreateAuctionFormData) => void
}

export const useCreateAuctionForm = (listeners?: UseCreateAuctionFormListeners) => {
  const form = useForm<CreateAuctionFormData>({
    defaultValues: {
      key: '',
    },
    mode: 'onChange',
    resolver: zodResolver(CreateAuctionSchema),
  })

  const state = useFormState({ control: form.control })

  const [createAuctionQuery, queryState] = useCreateAuctionMutation()

  const submitForm: SubmitHandler<CreateAuctionFormData> = async (formData) => {
    const createAuctionResponse = await createAuctionQuery(formData)

    if (createAuctionResponse.error) {
      const error = createAuctionResponse.error as AxiosBaseQueryError

      return listeners?.onError && listeners.onError(error)
    }

    listeners?.onSuccess && listeners.onSuccess({ ...createAuctionResponse.data, ...formData })
  }

  return { form, state, submitForm, queryState }
}
