import { cn } from '@/lib/utils'
import { Input } from '@ui/Input/input'
import SliderContent from '@ui/Slider/SliderContent'
import { useSliderContext } from '@ui/Slider/SliderContext'
import { Icons } from '@ui/icons'
import { SliderTrigger } from '@ui/index'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type CreateAuctionForm = {
  password: string
}

const SliderCreateContent = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true)

  const {
    func: { setSelectedKey },
  } = useSliderContext()

  const { control, handleSubmit } = useForm<CreateAuctionForm>({
    defaultValues: {
      password: '',
    },
  })
  const onSubmit: SubmitHandler<CreateAuctionForm> = () => {
    setIsLoading(true)
    setTimeout(() => setSelectedKey('successCreate'), 5000)
  }

  return (
    <SliderContent
      className="relative flex h-full w-full flex-col gap-y-6"
      value="create"
    >
      <SliderTrigger className="absolute -top-16 left-0" value="welcome">
        <button className="flex items-center justify-center gap-x-1 rounded-medium bg-dark px-5 py-2.5 text-body font-medium leading-4 text-gray-accent transition-all hover:bg-opacity-70 xl:py-2.5 xl:text-body xl:leading-3">
          <Icons.ReturnArrow width={21} height={21} />
          Назад
        </button>
      </SliderTrigger>

      <div className="flex flex-col gap-y-2">
        <h1 className="text-titleXL font-bold leading-5 2xl:text-[24px] 2xl:leading-7">
          Создание нового аукциона
        </h1>
        <h4 className="text-body font-medium text-gray">
          Для продолжения введите желаемый пароль от аукциона, который после
          будет использоваться вами для входа в аукцион в роли администратора.
          Затем нажмите кнопку "Создать"
        </h4>
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
              placeholder="••••••••"
              label={{
                id: 'password',
                value: 'Пароль от аукциона (не менее 6 символов)',
              }}
              {...field}
            />
          )}
        />

        <button
          className={cn(
            'w-full rounded-medium bg-green py-2.5 text-body font-medium leading-4 opacity-100 transition-[bg-opacity] hover:bg-opacity-70 xl:py-4 xl:text-body xl:leading-3',
            isLoading && 'opacity-70 hover:bg-opacity-100'
          )}
          type={isLoading ? 'button' : 'submit'}
          disabled={isLoading ? true : false}
        >
          {isLoading ? 'Создаем аукцион...' : 'Создать'}
        </button>
      </form>
      <div></div>
    </SliderContent>
  )
}

export default SliderCreateContent
