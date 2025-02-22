import { useEffect, useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'

import { auctionActions } from '~entities/auction/store'

import { createAuction } from '~shared/api/http/auction/auction.api'
import { loginInAuction } from '~shared/api/http/auth/auth.api'

import { appActions } from '~shared/store/slices'

import { useStoreDispatch } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { toastErrorNotification } from '~shared/ui/toaster/lib'

import { cn } from '~shared/utils'

import { CreateAuctionFormData, CreateAuctionSchema } from '../model'

type CreateAuctionFormProps = Partial<{
  onSuccess: () => void
  onError: () => void
}>

export const CreateAuctionForm = (props: CreateAuctionFormProps) => {
  const dispatch = useStoreDispatch()

  const [isPending, setIsPending] = useState(false)
  const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true)

  const abortController = useMemo(() => new AbortController(), [])

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

  const onSubmit: SubmitHandler<CreateAuctionFormData> = async ({ key }) => {
    try {
      setIsPending(true)
      const response = await createAuction(key, {
        signal: abortController.signal,
      })

      await loginInAuction(response.data.auctionId, key, {
        signal: abortController.signal,
      })

      dispatch(
        auctionActions.setAuction({
          id: response.data.auctionId,
          url: response.data.url,
          createAt: Date.now(),
        })
      )

      dispatch(appActions.setAuctionId(response.data.auctionId))
      dispatch(appActions.setAuctionUrl(response.data.url))

      setIsPending(false)

      props.onSuccess && props.onSuccess()
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data
        toastErrorNotification(
          'Не удалось создать аукцион',
          typeof errorMessage !== 'string'
            ? JSON.stringify(errorMessage)
            : errorMessage
        )
      }
      setIsPending(false)
      props.onError && props.onError()
    }
  }

  useEffect(() => {
    return () => {
      if (isPending) {
        abortController.abort()
        setIsPending(false)
      }
    }
  }, [])

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
        className={cn(isPending && 'opacity-70 hover:bg-opacity-100')}
        variant="action"
        type={isPending ? 'button' : 'submit'}
        disabled={isPending}
      >
        {isPending ? 'Создаем аукцион...' : 'Создать'}
      </Button>
    </form>
  )
}
