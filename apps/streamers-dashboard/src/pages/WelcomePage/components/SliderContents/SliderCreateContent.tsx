import { useEffect, useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { createAuction } from '@api/entities/auction/auction.api'
import { loginInAuction } from '@api/entities/auth/auth.api'
import { useStoreDispatch } from '@store/hooks'
import { appActions } from '@store/slices/app.slice'
import { auctionActions } from '@store/slices/auction.slice'

import { Input } from '@ui/Input/input'
import SliderContent from '@ui/Slider/SliderContent'
import { useSliderContext } from '@ui/Slider/SliderContext'
import Typography from '@ui/Typograghy/Typography'
import { Icons } from '@ui/icons'
import { Button, SliderTrigger } from '@ui/index'

type CreateAuctionForm = {
  password: string
}

const SliderCreateContent = () => {
  const dispatch = useStoreDispatch()

  const [isPending, setIsPending] = useState(false)
  const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true)

  const abortController = useMemo(() => new AbortController(), [])

  const {
    func: { setSelectedKey },
  } = useSliderContext()

  const { control, handleSubmit } = useForm<CreateAuctionForm>({
    defaultValues: {
      password: '',
    },
  })

  const onSubmit: SubmitHandler<CreateAuctionForm> = async ({ password }) => {
    try {
      setIsPending(true)
      const response = await createAuction(password, {
        signal: abortController.signal,
      })
      await loginInAuction(response.data.auctionId, password, {
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
          Для продолжения введите выданный вам мастер-пароль. Далее он также
          будет использоваться вами для входа в аукцион в роли администратора.
          После ввода нажмите кнопку "Создать"
        </Typography>
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
              placeholder="••••••••"
              label={{
                id: 'password',
                value: 'Пароль от аукциона (не менее 6 символов)',
              }}
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
