import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { SliderContent, SliderTrigger } from '~shared/ui/slider'
import { Typography } from '~shared/ui/typograghy'

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

  const onSubmit: SubmitHandler<LoginAuction> = async (formData) => {}

  return (
    <SliderContent
      className="relative flex h-full w-full flex-col gap-y-6"
      value="admin"
    >
      <SliderTrigger className="absolute -top-16 left-0" value="roles">
        <Button startContent={<Icons.ReturnArrow size="default" />}>
          Назад
        </Button>
      </SliderTrigger>

      <div className="flex flex-col gap-y-2">
        <Typography tag="h1">Вход в аукцион в роли администратора</Typography>
        <Typography tag="p" className="text-gray">
          Для продолжения введите номер аукциона, а также пароль. После нажмите
          кнопку "Войти"
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
                  <Icons.Id size="default" className="text-gray-accent" />
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
                  <Icons.Key size="default" className="text-gray-accent" />
                }
                endContent={
                  isPasswordHidden ? (
                    <Icons.EyeClosed
                      size="default"
                      className="cursor-pointer select-none text-gray transition-colors hover:text-gray-light"
                      onClick={() => setIsPasswordHidden(false)}
                    />
                  ) : (
                    <Icons.EyeOpen
                      size="default"
                      className="cursor-pointer select-none text-gray transition-colors hover:text-gray-light"
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
