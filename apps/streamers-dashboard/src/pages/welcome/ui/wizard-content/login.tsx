import { WELCOME_PAGE_WIZARD_ITEMS_IDS } from '~pages/welcome/constants'

import { refreshTokens } from '~shared/api/http/auth/auth.api'

import { Text, Title } from '~shared/components/typography'

import { useAsync } from '~shared/hooks'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { authSliceActions, authSliceSelectors } from '~shared/store/slices'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { toastErrorNotification } from '~shared/ui/toaster/lib'
import type { WizardItemProps } from '~shared/ui/wizard'
import { WizardItem, WizardTrigger } from '~shared/ui/wizard'
import { useWizardContext } from '~shared/ui/wizard/context'

import { cn } from '~shared/utils'
import { isTokenExpires } from '~shared/utils/validation'

import { AuthTwitchButton } from '../buttons/auth-twitch-button.ui'

export const WizardLoginItem = (
  props: Omit<WizardItemProps, 'value' | 'children'>,
) => {
  const { className, ...restProps } = props

  const lastRefreshTimestamp = useStoreSelector(authSliceSelectors.getLastRefreshTimestamp)

  const { setIsAuth, setLastRefreshTimestamp } = useActionCreators(authSliceActions)

  const { currentStepId, next } = useWizardContext()

  const authRefresh = async () => {
    if (currentStepId !== WELCOME_PAGE_WIZARD_ITEMS_IDS.LOGIN)
      return

    if (!isTokenExpires('access', lastRefreshTimestamp)) {
      setIsAuth(true)
      next(WELCOME_PAGE_WIZARD_ITEMS_IDS.CREATE_AUCTION, { force: true })

      return
    }

    const response = await refreshTokens()

    if (response.status === 200) {
      setIsAuth(true)
      setLastRefreshTimestamp(Date.now())

      next(WELCOME_PAGE_WIZARD_ITEMS_IDS.CREATE_AUCTION, { force: true })
    }
  }

  const refreshTokensQuery = useAsync(authRefresh, [currentStepId])

  if (refreshTokensQuery.isLoading) {
    return (
      <WizardItem
        className={cn('flex flex-col gap-y-6 items-center justify-center')}
        value={WELCOME_PAGE_WIZARD_ITEMS_IDS.LOGIN}
        {...restProps}
      >
        <Icons.Loading size="lg" />
      </WizardItem>
    )
  }

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
