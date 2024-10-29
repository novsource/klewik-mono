import { Input } from '@ui/Input/input'
import SliderContent from '@ui/Slider/SliderContent'
import { Icons } from '@ui/icons'
import { SliderTrigger } from '@ui/index'

import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type LoginAuction = {
  auctionId: string
  password: string
}

const SliderAdminContent = () => {
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
        <button className="flex items-center justify-center gap-x-1 rounded-medium bg-dark px-5 py-2.5 text-body font-medium leading-4 text-gray-accent transition-all hover:bg-opacity-70 xl:py-2.5 xl:text-body xl:leading-3">
          <Icons.ReturnArrow width={21} height={21} />
          Назад
        </button>
      </SliderTrigger>

      <div className="flex flex-col gap-y-2">
        <h1 className="text-titleXL font-bold leading-5 2xl:text-[24px] 2xl:leading-7">
          Вход в аукцион в роли администратора
        </h1>
        <h4 className="text-body font-medium text-gray">
          Для продолжения введите номер аукциона, а также пароль, указанный при
          его создании. После нажмите кнопку "Войти"
        </h4>
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
                type="text"
                className="font-semibold tracking-wide"
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
                type="password"
                label={{ id: 'password', value: 'Пароль от аукциона' }}
                placeholder="••••••••"
                {...field}
              />
            )}
          />
        </div>
        <button
          className="w-full rounded-medium bg-green py-2.5 text-body font-medium leading-4 transition-all hover:bg-opacity-70 xl:py-4 xl:text-body xl:leading-3"
          type="submit"
        >
          Войти
        </button>
      </form>
    </SliderContent>
  )
}

export default SliderAdminContent
