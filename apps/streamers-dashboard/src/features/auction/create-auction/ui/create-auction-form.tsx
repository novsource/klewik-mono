import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { auctionActions as storeAuctionActions } from '~entities/auction/store'

import { loginInAuction } from '~shared/api/http/auth'

import {
  AxiosBaseQueryError,
  useActionCreators,
} from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { toastErrorNotification } from '~shared/ui/toaster/lib'

import { cn } from '~shared/utils'

import { useCreateAuctionMutation } from '../api'
import { CreateAuctionFormData, CreateAuctionSchema } from '../model'

type CreateAuctionFormProps = Partial<{
  onSuccess: () => void
  onError: () => void
}>

export const CreateAuctionForm = (props: CreateAuctionFormProps) => {
  const auctionActions = useActionCreators(storeAuctionActions)

  const [createAuctionMutation, { isLoading }] = useCreateAuctionMutation()

  const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAuctionFormData>({
    defaultValues: {
      key: '',
    },
    mode: 'onChange',
    resolver: zodResolver(CreateAuctionSchema),
  })

  const onSubmit: SubmitHandler<CreateAuctionFormData> = async (formData) => {
    const createAuctionResponse = await createAuctionMutation(formData)

    if (createAuctionResponse.error) {
      const error = createAuctionResponse.error as AxiosBaseQueryError

      toastErrorNotification('Не удалось создать аукцион', error.reason)
      props.onError && props.onError()

      return
    }

    await loginInAuction(createAuctionResponse.data.auctionUUID, formData.key)

    auctionActions.setAuction({
      auctionUUID: createAuctionResponse.data.auctionUUID,
      url: createAuctionResponse.data.url,
    })

    props.onSuccess && props.onSuccess()
  }

  return (
    <form
      className="flex w-full flex-col gap-y-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="key"
        render={({ field }) => (
          <Input
            type={isPasswordHidden ? 'password' : 'text'}
            label={{
              id: 'password',
              value: 'Мастер-ключ',
            }}
            errorMessage={errors.key?.message}
            placeholder="••••••••"
            endContent={
              isPasswordHidden ? (
                <Icons.EyeClosed
                  className="cursor-pointer select-none text-gray transition-colors hover:text-gray-light"
                  size="default"
                  onClick={() => setIsPasswordHidden(false)}
                />
              ) : (
                <Icons.EyeOpen
                  className="cursor-pointer select-none text-gray transition-colors hover:text-gray-light"
                  size="default"
                  onClick={() => setIsPasswordHidden(true)}
                />
              )
            }
            {...field}
          />
        )}
      />

      <Button
        className={cn(isLoading && 'opacity-70 hover:bg-opacity-100')}
        variant="action"
        type={isLoading ? 'button' : 'submit'}
        disabled={isLoading}
      >
        {isLoading ? 'Создаем аукцион...' : 'Создать'}
      </Button>
    </form>
  )
}
