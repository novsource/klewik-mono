import { useEffect, useRef, useState } from 'react'

import z from 'zod'

import { useLocalStorage } from '~shared/hooks/use-local-storage'

import { genuuid } from '~shared/utils/common'

type UseAuthTwitchReturnValue = {
  state: {
    isAuth: boolean
    isLoading: boolean
  }
  actions: {
    openTwitchAuthWindow: () => void
  }
}

const TwitchAuthLocalStorageStateSchema = z.object({
  state: z.uuid().nullable(),
  status: z.enum(['success', 'error', 'idle']),
  reason: z.string().optional(),
})

type TwitchAuthLocalStorageState = Maybe<z.infer<typeof TwitchAuthLocalStorageStateSchema>>

type UseAuthTwitchOptions = {
  onSuccess?: () => void
  onError?: () => void
}

export const useAuthTwitch = (options?: UseAuthTwitchOptions): UseAuthTwitchReturnValue => {
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const optionsRef = useRef(options)
  optionsRef.current = options

  const twitchAuthLocalStorageState = useLocalStorage<Maybe<TwitchAuthLocalStorageState>>('twitchAuthState', {
    deserializer: (value) => {
      let deserializedValue: any

      try {
        deserializedValue = JSON.parse(value)
      }
      catch {
        return {
          state: null,
          status: 'error',
          reason: 'Invalid local storage value',
        }
      }

      const validatedValueResult = TwitchAuthLocalStorageStateSchema.safeParse(deserializedValue)

      if (!validatedValueResult.success) {
        return {
          state: null,
          status: 'error',
          reason: 'Invalid state value',
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
      state: generatedState,
      status: 'idle',
    })

    window.open(twitchAuthURL, '_blank')
  }

  useEffect(() => {
    if (twitchAuthLocalStorageState.value === undefined) {
      return
    }

    const castedLocalStorageValue = twitchAuthLocalStorageState.value as TwitchAuthLocalStorageState
    const isSuccessedAuth = castedLocalStorageValue?.status === 'success' && !isAuth

    console.log(twitchAuthLocalStorageState)

    if (isSuccessedAuth && isLoading) {
      optionsRef.current?.onSuccess?.()

      setIsAuth(true)
      setIsLoading(false)
    }

    if (isSuccessedAuth && isLoading) {
      optionsRef.current?.onError?.()
      setIsLoading(false)
    }

    return () => {
      twitchAuthLocalStorageState.remove()
    }
  }, [twitchAuthLocalStorageState, isAuth, isLoading])

  return {
    state: {
      isAuth,
      isLoading,
    },
    actions: {
      openTwitchAuthWindow,
    },
  }
}
