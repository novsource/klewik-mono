import { cn } from '@/lib/utils'
import { Input } from '@ui/Input/input'
import SliderContent from '@ui/Slider/SliderContent'
import { useSliderContext } from '@ui/Slider/SliderContext'
import Typography from '@ui/Typograghy/Typography'
import { Icons } from '@ui/icons'
import { Button, SliderTrigger } from '@ui/index'
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
        <Button startContent={<Icons.ReturnArrow width={21} height={21} />}>
          Назад
        </Button>
      </SliderTrigger>

      <div className="flex flex-col gap-y-2">
        <Typography tag="h1">Создание нового аукциона</Typography>
        <Typography tag="p" className="text-gray">
          Для продолжения введите желаемый пароль от аукциона, который после
          будет использоваться вами для входа в аукцион в роли администратора.
          Затем нажмите кнопку "Создать"
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
                    className="text-gray"
                    width={18}
                    height={18}
                    onClick={() => setIsPasswordHidden(false)}
                  />
                ) : (
                  <Icons.EyeOpen
                    className="text-gray"
                    width={18}
                    height={18}
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
          className={cn(isLoading && 'opacity-70 hover:bg-opacity-100')}
          variant="action"
          type={isLoading ? 'button' : 'submit'}
          disabled={isLoading}
        >
          {isLoading ? 'Создаем аукцион...' : 'Создать'}
        </Button>
      </form>
    </SliderContent>
  )
}

export default SliderCreateContent
