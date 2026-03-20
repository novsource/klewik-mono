import type { SelectPositions, SelectSizes } from '../styles'

import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'

import { objectToDeps } from '~utils/cn'

export type SelectContextState = Partial<
  Record<'size', keyof SelectSizes['size']>
  & Record<'position', keyof SelectPositions['position']>
>

const SelectContext = createContext<SelectContextState>({
  size: 'default',
  position: 'item-aligned',
})

const useSelectContext = () => {
  const context = useContext(SelectContext)

  if (!context)
    throw new Error('You should use context inside provider!')

  return context
}

type SelectProviderProps = SelectContextState & {
  children: ReactNode
}

const SelectProvider = ({ children, ...contextValue }: SelectProviderProps) => {
  const value = useMemo(() => contextValue, [...objectToDeps(contextValue, ['position', 'size'])])

  return (
    <SelectContext.Provider value={value}>
      {children}
    </SelectContext.Provider>
  )
}

export { SelectProvider }
export { useSelectContext }
