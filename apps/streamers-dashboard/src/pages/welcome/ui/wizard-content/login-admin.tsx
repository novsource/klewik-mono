import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { WELCOME_PAGE_WIZARD_ITEMS_IDS } from '~pages/welcome/constants'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { Typography } from '~shared/ui/typograghy'
import { WizardItem, WizardItemProps, WizardTrigger } from '~shared/ui/wizard'

import { cn } from '~shared/utils'

type LoginAuction = {
  auctionId: string
  password: string
}

const WizardLoginAdminItem = (
  props: Omit<WizardItemProps, 'value' | 'children'>
) => {
  const { className, ...restProps } = props
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const { control, handleSubmit } = useForm<LoginAuction>({
    defaultValues: {
      auctionId: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<LoginAuction> = async (formData) => {}

  return (
    <WizardItem
      value={WELCOME_PAGE_WIZARD_ITEMS_IDS.LOGIN_ADMIN}
      className={cn(className)}
      {...restProps}
    >
      <WizardTrigger type="back">
        <Button startContent={<Icons.ReturnArrow size="default" />}>
          Назад
        </Button>
      </WizardTrigger>

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
                      className="cursor-pointer text-gray transition-colors select-none hover:text-gray-light"
                      onClick={() => setIsPasswordHidden(false)}
                    />
                  ) : (
                    <Icons.EyeOpen
                      size="default"
                      className="cursor-pointer text-gray transition-colors select-none hover:text-gray-light"
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
    </WizardItem>
  )
}

export { WizardLoginAdminItem }
