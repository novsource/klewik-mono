import { ReactNode, createContext, useContext, useMemo } from 'react'

type CardContext = {
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'slots'
}

export type CardContextProps = CardContext & {
  children: ReactNode
}

const CardContext = createContext<NullablePossible<CardContext>>(null)

export const CardProvider = ({
  children,
  ...contextProps
}: CardContextProps) => {
  const styleProps = useMemo(
    () => ({ size: contextProps.size, variant: contextProps.variant }),
    [...Object.keys(contextProps)]
  )

  return (
    <CardContext.Provider value={styleProps}>{children}</CardContext.Provider>
  )
}

export const useCardContext = () => {
  const context = useContext(CardContext)

  if (!context) throw Error("Can't use card with no context")

  return context
}
