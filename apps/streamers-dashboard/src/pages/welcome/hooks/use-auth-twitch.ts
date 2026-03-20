import { useEffect, useRef, useState } from 'react'

import { AuthTwitchParamsSchema } from '~features/integrations/connect-integration/model/connect-integration.models'
import type { AuthTwitchRedirectParams } from '~features/integrations/connect-integration/model/connect-integration.types'

import { useLocalStorage } from '~shared/hooks/use-local-storage'

import { genuuid } from '~shared/utils/common'

type UseAuthTwitchReturnValue = {
  state: {
    isAuth: boolean
    isError: boolean
    isLoading: boolean
  }
  actions: {
    openTwitchAuthWindow: () => void
  }
}

type UseAuthTwitchOptions = {
  onSuccess?: () => void
  onError?: () => void
}

export const useAuthTwitch = (options?: UseAuthTwitchOptions): UseAuthTwitchReturnValue => {
  const [isAuth, setIsAuth] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const optionsRef = useRef(options)
  optionsRef.current = options

  const twitchAuthLocalStorageState = useLocalStorage<Maybe<AuthTwitchRedirectParams>>('twitchAuthState', {
    deserializer: (value) => {
      let deserializedValue: any

      try {
        deserializedValue = JSON.parse(value)
      }
      catch {
        return {
          auth: false,
          state: '',
          error: true,
          errorReason: 'Invalid local storage value',
          provider: 'twitch',
        }
      }

      const validatedValueResult = AuthTwitchParamsSchema.safeParse(deserializedValue)

      if (!validatedValueResult.success) {
        return {
          auth: false,
          state: '',
          error: true,
          errorReason: 'Invalid state value',
          provider: 'twitch',
        }
      }

      return validatedValueResult.data
    },
  })

  const openTwitchAuthWindow = () => {
    setIsLoading(true)

    const generatedState = genuuid()

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: import.meta.env.VITE_TWITCH_APP_ID,
      redirect_uri: import.meta.env.VITE_TWITCH_REDIRECT_URI_DEV,
      state: generatedState,
    })

    const twitchAuthURL = new URL('https://id.twitch.tv/oauth2/authorize')
    twitchAuthURL.search = params.toString()

    twitchAuthLocalStorageState.set({
      auth: false,
      state: generatedState,
      provider: 'twitch',
    })

    window.open(twitchAuthURL, '_blank')
  }

  useEffect(() => {
    if (twitchAuthLocalStorageState.value === undefined) {
      return
    }

    const castedLocalStorageValue = twitchAuthLocalStorageState.value as AuthTwitchRedirectParams
    const isSuccessedAuth = castedLocalStorageValue?.auth && !castedLocalStorageValue?.error
    const isHaveError = castedLocalStorageValue.error === false

    if (isSuccessedAuth && isLoading) {
      optionsRef.current?.onSuccess?.()

      setIsAuth(true)
      setIsLoading(false)
    }

    if (isHaveError && isLoading) {
      optionsRef.current?.onError?.()

      setIsError(true)
      setIsLoading(false)
    }

    return () => {
      twitchAuthLocalStorageState.remove()
    }
  }, [twitchAuthLocalStorageState, isAuth, isLoading])

  return {
    state: {
      isAuth,
      isError,
      isLoading,
    },
    actions: {
      openTwitchAuthWindow,
    },
  }
}
