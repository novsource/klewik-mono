import { Input } from '@ui/Input/Input'
import SliderContent from '@ui/Slider/SliderContent'
import { Icons } from '@ui/icons'
import { Button, SliderTrigger, Typography } from '@ui/index'
import { useState } from 'react'

import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type LoginAuction = {
  auctionId: string
  password: string
}

const SliderAdminContent = () => {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const { control, handleSubmit } = useForm<LoginAuction>({
    defaultValues: {
      auctionId: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<LoginAuction> = console.log

  return (
    <SliderContent
      className="relative flex h-full w-full flex-col gap-y-6"
      value="admin"
    >
      <SliderTrigger className="absolute -top-16 left-0" value="roles">
        <Button startContent={<Icons.ReturnArrow width={21} height={21} />}>
          Назад
        </Button>
      </SliderTrigger>

      <div className="flex flex-col gap-y-2">
        <Typography tag="h1">Вход в аукцион в роли администратора</Typography>
        <Typography tag="p" className="text-gray">
          Для продолжения введите номер аукциона, а также пароль, указанный при
          его создании. После нажмите кнопку "Войти"
        </Typography>
      </div>

      <form
        className="flex w-full flex-col gap-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-y-4">
          <Controller
            name="auctionId"
            control={control}
            render={({ field }) => (
              <Input
                className="font-semibold tracking-wide"
                type="text"
                startContent={
                  <Icons.Id
                    width={18}
                    height={18}
                    className="text-gray-accent"
                  />
                }
                label={{ id: 'auctionId', value: 'Номер аукциона' }}
                placeholder="xxxxxxxx&mdash;xxxx&mdash;xxxx&mdash;xxxx&mdash;xxxxxxxxxxxx"
                {...field}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                type={isPasswordHidden ? 'password' : 'text'}
                startContent={
                  <Icons.Key
                    width={18}
                    height={18}
                    className="text-gray-accent"
                  />
                }
                endContent={
                  isPasswordHidden ? (
                    <Icons.EyeClosed
                      width={18}
                      height={18}
                      className="cursor-pointer text-gray"
                      onClick={() => setIsPasswordHidden(false)}
                    />
                  ) : (
                    <Icons.EyeOpen
                      width={18}
                      height={18}
                      className="cursor-pointer text-gray"
                      onClick={() => setIsPasswordHidden(true)}
                    />
                  )
                }
                label={{ id: 'password', value: 'Пароль от аукциона' }}
                placeholder="••••••••"
                {...field}
              />
            )}
          />
        </div>
        <Button variant={'action'} type="submit">
          Войти
        </Button>
      </form>
    </SliderContent>
  )
}

export default SliderAdminContent
