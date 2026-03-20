import type { AxiosError } from 'axios'

import type { SetAuctionViewParametersFormData } from '../model'

import { useForm, useFormState } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'

import { auctionSelectors } from '~entities/auction/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { useSetAuctionViewParametersMutation } from '../api'
import { AuctionViewParametersFormSchema } from '../model'

type UseAuctionInitialParametersFormArgs = {
  onSuccess?: () => void
  onError?: (error: AxiosError) => void
}

export const useAuctionInitialParametersForm = (args?: UseAuctionInitialParametersFormArgs) => {
  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const form = useForm<SetAuctionViewParametersFormData>({
    defaultValues: {
      title: '',
    },
    resolver: zodResolver(AuctionViewParametersFormSchema),
  })

  const state = useFormState({ control: form.control })

  const [setAuctionViewParametersMutation, submitQueryState] = useSetAuctionViewParametersMutation()

  const submitFormRequest = async (formData: SetAuctionViewParametersFormData) => {
    try {
      const response = await setAuctionViewParametersMutation({ auctionUUID, details: formData })

      if (response.error) {
        throw response.error
      }

      args?.onSuccess?.()
    }
    catch (error) {
      if (isAxiosError(error)) {
        args?.onError?.(error)
      }
    }
  }

  const submit = form.handleSubmit(submitFormRequest)

  return { form, state, submitRequest: submitFormRequest, submitForm: submit, submitQueryState }
}
