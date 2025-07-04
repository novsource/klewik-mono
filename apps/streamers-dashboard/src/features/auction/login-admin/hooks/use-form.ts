import type { LoginAdmin } from '../model'

import { useForm, useFormState } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import type { AxiosBaseQueryError } from '~shared/lib/redux-toolkit'

import { useLoginAdminMutation } from '../api'
import { LOGIN_ADMIN_FORM_DEFAULT_VALUES } from '../constants'
import { loginAdminSchema } from '../model'

export type UseLoginAdminFormOptions = {
  onSuccess?: (formData: LoginAdmin) => void
  onError?: (error: AxiosBaseQueryError) => void
}

const useLoginAdminForm = (options?: UseLoginAdminFormOptions) => {
  const form = useForm<LoginAdmin>({
    defaultValues: LOGIN_ADMIN_FORM_DEFAULT_VALUES,
    resolver: zodResolver(loginAdminSchema),
    reValidateMode: 'onChange',
  })

  const state = useFormState({ control: form.control })

  const [loginAdminMutation, queryState] = useLoginAdminMutation()

  const submitForm = async (formData: LoginAdmin) => {
    const response = await loginAdminMutation(formData)

    console.log(response)

    if (response.error) {
      return options?.onError && options.onError(response.error as AxiosBaseQueryError)
    }

    options?.onSuccess && options.onSuccess(formData)
  }

  return { form, state, submitForm, queryState }
}

export { useLoginAdminForm }
