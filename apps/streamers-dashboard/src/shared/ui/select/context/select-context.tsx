import { ReactNode, createContext, useContext } from 'react'

import { SelectPositions, SelectSizes } from '../styles'

export type SelectContextState = Partial<
  Record<'size', keyof SelectSizes['size']> &
    Record<'position', keyof SelectPositions['position']>
>

const SelectContext = createContext<SelectContextState>({
  size: 'default',
  position: 'item-aligned',
})

const useSelectContext = () => {
  const context = useContext(SelectContext)

  if (!context) throw new Error('You should use context inside provider!')

  return context
}

type SelectProviderProps = SelectContextState & {
  children: ReactNode
}

const SelectProvider = ({ children, ...contextValue }: SelectProviderProps) => {
  return (
    <SelectContext.Provider value={contextValue}>
      {children}
    </SelectContext.Provider>
  )
}

export { SelectProvider }
export { useSelectContext }
