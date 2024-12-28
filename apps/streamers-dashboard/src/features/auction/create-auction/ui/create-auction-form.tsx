import { useEffect, useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { z } from 'zod'

import { appActions } from '~app/providers/store/slices/app.slice'

import { auctionActions } from '~entities/auction/store'

import { createAuction } from '~shared/api/http/entities/auction/auction.api'
import { loginInAuction } from '~shared/api/http/entities/auth/auth.api'
import { useStoreDispatch } from '~shared/lib/redux-toolkit'
import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { toastErrorNotification } from '~shared/ui/toaster/lib'
import { cn } from '~shared/utils'

const createAuctionSchema = z.object({
  password: z.string().refine((check) => check.length >= 1, {
    message: 'Поле не может быть пустым',
  }),
})

type CreateAuctionForm = z.infer<typeof createAuctionSchema>

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
  } = useForm<CreateAuctionForm>({
    defaultValues: {
      password: '',
    },
    mode: 'onChange',
    resolver: zodResolver(createAuctionSchema),
  })

  const onSubmit: SubmitHandler<CreateAuctionForm> = async ({ password }) => {
    console.log(password, isPending)
    try {
      setIsPending(true)
      const response = await createAuction(password, {
        signal: abortController.signal,
      })

      await loginInAuction(response.data.auctionId, '', {
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
      console.log('here')
      if (axios.isAxiosError(err)) {
        toastErrorNotification('Не удалось создать аукцион', err.response?.data)
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
        name="password"
        render={({ field }) => (
          <Input
            type={isPasswordHidden ? 'password' : 'text'}
            label={{
              id: 'password',
              value: 'Мастер-ключ',
            }}
            errorMessage={errors.password?.message}
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
