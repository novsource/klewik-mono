import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
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
    <SliderContent className="slider-content" value="admin">
      <SliderTrigger value="roles">
        <Button startContent={<Icons.ReturnArrow size="default" />}>
          Назад
        </Button>
      </SliderTrigger>

      <Flex className="gap-y-2" direction="column">
        <Typography tag="h1">Вход в аукцион в роли администратора</Typography>
        <Typography tag="p" className="text-gray">
          Для продолжения введите номер аукциона, а также пароль. После нажмите
          кнопку "Войти"
        </Typography>
      </Flex>

      <Flex
        className="w-full gap-y-6"
        component="form"
        direction="column"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Flex className="gap-y-4" direction="column">
          <Controller
            name="auctionId"
            control={control}
            render={({ field }) => (
              <Input
                slotClassNames={{ input: 'font-semibold tracking-wide' }}
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
        </Flex>
        <Button variant={'action'} type="submit">
          Войти
        </Button>
      </Flex>
    </SliderContent>
  )
}

export default SliderAdminContent
