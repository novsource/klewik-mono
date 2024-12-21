import { useEffect, useMemo, useState } from 'react'
import {
  Controller,
  FieldErrors,
  Resolver,
  ResolverResult,
  SubmitHandler,
  useForm,
} from 'react-hook-form'

import axios from 'axios'
import { toast } from 'sonner'
import { z } from 'zod'

import { appActions } from '~app/providers/store/slices/app.slice'
import { auctionActions } from '~app/providers/store/slices/auction.slice'

import { createAuction } from '~shared/api/entities/auction/auction.api'
import { loginInAuction } from '~shared/api/entities/auth/auth.api'
import { useStoreDispatch } from '~shared/lib/redux-toolkit'
import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import {
  SliderContent,
  SliderTrigger,
  useSliderContext,
} from '~shared/ui/slider'
import { Typography } from '~shared/ui/typograghy'
import { cn } from '~shared/utils'

const createAuctionSchema = z.object({
  password: z.string().refine((check) => check.length >= 1, {
    message: 'Поле не может быть пустым',
  }),
})

type CreateAuctionForm = z.infer<typeof createAuctionSchema>

const formResolver = (
  values: CreateAuctionForm
): ResolverResult<Resolver<CreateAuctionForm>> => {
  const result = createAuctionSchema.safeParse(values)

  if (!result.success) {
    return {
      values: {},
      errors: result.error.errors.reduce<FieldErrors<CreateAuctionForm>>(
        (acc, error) => {
          const fieldName = error.path[0] as keyof CreateAuctionForm

          acc[fieldName] = {
            type: error.code,
            message: error.message,
          }

          return acc
        },
        {}
      ),
    }
  }
  return {
    values: result.data,
    errors: {},
  }
}

const SliderCreateContent = () => {
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
    resolver: formResolver,
  })

  const {
    func: { setSelectedKey },
  } = useSliderContext()

  const onSubmit: SubmitHandler<CreateAuctionForm> = async ({ password }) => {
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
          _id: response.data.auctionId,
          url: response.data.url,
          startDate: Date.now(),
        })
      )

      dispatch(appActions.setAuctionId(response.data.auctionId))
      dispatch(appActions.setAuctionUrl(response.data.url))

      setSelectedKey('successCreate')
      setIsPending(false)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast(err.response?.data)
      }
      setIsPending(false)
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
    <SliderContent
      className="relative flex h-full w-full flex-col gap-y-6"
      value="create"
    >
      <SliderTrigger className="absolute -top-16 left-0" value="welcome">
        <Button
          startContent={<Icons.ReturnArrow size="lg" />}
          onClick={abortController.abort}
        >
          Назад
        </Button>
      </SliderTrigger>

      <div className="flex flex-col gap-y-2">
        <Typography tag="h1">Создание нового аукциона</Typography>
        <Typography tag="p" className="text-gray">
          Для продолжения введите выданный вам мастер-пароль. Позже он также
          будет использоваться вами для входа в аукцион в роли администратора.
          После ввода нажмите кнопку "Создать"
        </Typography>
        {errors.root?.message}
      </div>
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
    </SliderContent>
  )
}

export default SliderCreateContent
