import type { Context, Provider } from 'react'
import { createContext, useContext as useReactContext } from 'react'

export type CreateReactContextOptions<T> = {
  hookName?: Maybe<string>
  contextName?: Maybe<string>
  providerName?: Maybe<string>
  initialValue?: Maybe<T>
  emptyContextMessage?: Maybe<string>
}

export type CreateReactContextReturnValue<T> = [Provider<T>, () => T, Context<T>]

export const createReactContext = <T>(options: CreateReactContextOptions<T>): CreateReactContextReturnValue<T> => {
  const {
    initialValue,
    hookName,
    contextName = 'Context',
    emptyContextMessage,
    providerName = 'Provider',
  } = options

  const Context = createContext<Maybe<T>>(initialValue)
  Context.displayName = contextName

  function useContext() {
    const context = useReactContext(Context)

    if (!context) {
      throw new Error(emptyContextMessage ?? `You should use ${hookName} inside <${providerName}/>`)
    }

    return context
  }

  return [Context.Provider, useContext, Context] as CreateReactContextReturnValue<T>
}
