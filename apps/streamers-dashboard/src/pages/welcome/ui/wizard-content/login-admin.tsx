import { useNavigate } from 'react-router-dom'

import { WELCOME_PAGE_WIZARD_ITEMS_IDS } from '~pages/welcome/constants'

import { LoginAdminForm } from '~features/auction/login-admin/ui'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { toastErrorNotification } from '~shared/ui/toaster/lib'
import { Typography } from '~shared/ui/typograghy'
import type { WizardItemProps } from '~shared/ui/wizard'
import { WizardItem, WizardTrigger } from '~shared/ui/wizard'

import { cn } from '~shared/utils'

const WizardLoginAdminItem = (
  props: Omit<WizardItemProps, 'value' | 'children'>,
) => {
  const navigate = useNavigate()

  const { className, ...restProps } = props

  return (
    <WizardItem
      value={WELCOME_PAGE_WIZARD_ITEMS_IDS.LOGIN_ADMIN}
      className={cn('flex flex-col w-full h-full gap-y-6 justify-center', className)}
      {...restProps}
    >
      <WizardTrigger type="back">
        <Button startContent={<Icons.ReturnArrow size="sm" />} size="sm">
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
      <LoginAdminForm
        slotsClassnames={{ base: 'flex flex-col gap-y-4' }}
        onSuccess={({ auctionId }) => {
          navigate({ pathname: `/dashboard/${auctionId}/` })
        }}
        onError={(error) => {
          toastErrorNotification('Не удалось войти в аукцион', error.message)
        }}
      />
    </WizardItem>
  )
}

export { WizardLoginAdminItem }
