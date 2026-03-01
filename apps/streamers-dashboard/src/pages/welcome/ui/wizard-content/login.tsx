import { WELCOME_PAGE_WIZARD_ITEMS_IDS } from '~pages/welcome/constants'

import { Text, Title } from '~shared/components/typography'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { toastErrorNotification } from '~shared/ui/toaster/lib'
import type { WizardItemProps } from '~shared/ui/wizard'
import { WizardItem, WizardTrigger } from '~shared/ui/wizard'
import { useWizardContext } from '~shared/ui/wizard/context'

import { cn } from '~shared/utils'

import { AuthTwitchButton } from '../buttons/auth-twitch-button.ui'

export const WizardLoginItem = (
  props: Omit<WizardItemProps, 'value' | 'children'>,
) => {
  const { className, ...restProps } = props

  const { next } = useWizardContext()

  return (
    <WizardItem
      className={cn('flex flex-col gap-y-6')}
      value={WELCOME_PAGE_WIZARD_ITEMS_IDS.LOGIN}
      {...restProps}
    >
      <WizardTrigger type="back">
        <Button startContent={<Icons.Undo size="xs" />} size="xs">Назад</Button>
      </WizardTrigger>

      <Flex className="gap-y-2" direction="column">
        <Title order={1}>Авторизация и создание аукциона</Title>
        <Text className="text-gray">
          Для создания аукциона необходимо пройти авторизацию при помощи платформы Twitch (это временная мера).
          Если вы уверены что ваш аккаунт зарегистрирован в системе,
          то нажми кнопку "Продолжить с Twitch"
        </Text>

      </Flex>

      <AuthTwitchButton
        onSuccess={() => {
          next(WELCOME_PAGE_WIZARD_ITEMS_IDS.CREATE_AUCTION)
        }}
        onError={() => {
          toastErrorNotification('Не удалось войти через Twitch')
        }}
      />

    </WizardItem>
  )
}
