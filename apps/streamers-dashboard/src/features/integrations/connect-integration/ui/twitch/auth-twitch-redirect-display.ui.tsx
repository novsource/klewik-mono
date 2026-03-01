import type { AuthTwitchRedirectParams } from '../../model/connect-integration.types'

import { useEffect } from 'react'

import { TWITCH_AUTH_LOCAL_STORAGE_STATE_NAME } from '~entities/integrations/constants'

import { useUrlSearchParams } from '~shared/hooks'
import { useLocalStorage } from '~shared/hooks/use-local-storage'

export const AuthTwitchRedirectDisplay = () => {
  const twitchIntegrationParams = useUrlSearchParams<AuthTwitchRedirectParams>()

  const twitchAuthLocalStorage = useLocalStorage<AuthTwitchRedirectParams>(TWITCH_AUTH_LOCAL_STORAGE_STATE_NAME)

  useEffect(() => {
    if (!twitchIntegrationParams.value) {
      twitchAuthLocalStorage.set({
        provider: 'twitch',
        state: '',
        auth: false,
        error: true,
        errorReason: 'Invalid params',
      })

      return
    }

    const isDifferentState = twitchAuthLocalStorage.value.state !== twitchIntegrationParams.value.state

    if (isDifferentState) {
      twitchAuthLocalStorage.set({
        provider: 'twitch',
        state: `${twitchAuthLocalStorage.value.state}; Get: ${twitchIntegrationParams.value.state}`,
        auth: false,
        error: true,
        errorReason: 'Invalid state value',
      })
      return
    }

    const isSuccessAuth = twitchIntegrationParams.value.auth && !twitchIntegrationParams.value.error

    if (isSuccessAuth) {
      twitchAuthLocalStorage.set({
        provider: 'twitch',
        state: twitchIntegrationParams.value.state,
        auth: true,
      })
    }
    else {
      twitchAuthLocalStorage.set({
        provider: 'twitch',
        state: twitchIntegrationParams.value.state,
        auth: false,
        error: true,
        errorReason: twitchIntegrationParams.value.errorReason ?? 'Unknown error',
      })
    }

    window.close()
  }, [twitchIntegrationParams, twitchAuthLocalStorage])

  return null
}
