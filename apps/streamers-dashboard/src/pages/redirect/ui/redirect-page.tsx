import { useLayoutEffect } from 'react'

import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'

import { RedirectDisplay } from '~features/integrations/connect-integration/ui'

import { INTEGRATIONS_PLATFORM_NAMES } from '~entities/integrations/constants'
import type { IntegrationsPlatforms } from '~entities/integrations/model'

import { Flex } from '~shared/ui/flex'

export const RedirectPage = () => {
  const params = useSearchParams()
  const navigate = useNavigate()

  // const twitchAuthLocalStorage = useLocalStorage(TWITCH_AUTH_LOCAL_STORAGE_STATE_NAME)

  useLayoutEffect(() => {
    const rootElement = document.getElementById('root')

    if (!rootElement) {
      return navigate('/')
    }

    const initialHeightStyle = rootElement.style.height
    rootElement.style.height = '100%'

    return () => {
      rootElement.style.height = initialHeightStyle
    }
  }, [navigate])

  // const isTwitchProvider = params[0].get('provider') === 'twitch'

  // if (isTwitchProvider) {
  //   const authState = params[0].get('state')

  //   const isInvalidComparingStateResult
  //     = !twitchAuthLocalStorage.value
  //       || !authState
  //       || twitchAuthLocalStorage.value.state !== authState

  //   if (isInvalidComparingStateResult) {
  //     twitchAuthLocalStorage.set({
  //       state: null,
  //       status: 'error',
  //       reason: 'Invalid state',
  //     })
  //   }

  //   const isSuccessAuth = Boolean(params[0].get('auth'))

  //   if (isSuccessAuth) {
  //     twitchAuthLocalStorage.set({
  //       state: authState,
  //       status: 'success',
  //     })
  //   }
  //   else {
  //     twitchAuthLocalStorage.set({
  //       state: authState,
  //       status: 'error',
  //       reason: params[0].get('error_reason') || 'Unknown error',
  //     })
  //   }

  //   window.close()
  // }

  const integrationProvider = params[0].get('provider') as NullablePossible<IntegrationsPlatforms>
  const isInvalidIntegrationProvider = !integrationProvider || !Reflect.has(INTEGRATIONS_PLATFORM_NAMES, integrationProvider)

  if (isInvalidIntegrationProvider) {
    return <Navigate to="/" />
  }

  return (
    <Flex className="w-full h-full" align="center" justify="center">
      <Flex className="relative gap-x-16 pb-8 tablet:gap-x-36" align="center">
        <RedirectDisplay platform={integrationProvider} />
      </Flex>
    </Flex>
  )
}
