import type {
  Dispatch,
  SetStateAction,
} from 'react'
import {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'

import { isStringEmpty } from '~shared/utils'

type TabsContextState = {
  state: {
    defaultKey: string
    selectedKey: string
    keys: string[]
    triggersData: TriggersData
  }
  dispatch: {
    setSelectedKey: Dispatch<SetStateAction<string>>
    setKeys: Dispatch<SetStateAction<string[]>>
    setTriggersData: Dispatch<SetStateAction<TriggersData>>
  }
}

type TabsContextProps = {
  value?: string
  defaultValue?: string
  children: JSX.Element
}

type TriggersData = {
  value: string
  width: number
  startX: number
}[]

export const TabsContext = createContext<NullablePossible<TabsContextState>>(null)

export const TabsContextProvider = ({
  children,
  defaultValue,
  value,
}: TabsContextProps) => {
  const [triggersData, setTriggersData] = useState<TriggersData>([])
  const [keys, setKeys] = useState<string[]>([])
  const [selectedKey, setSelectedKey] = useState<string>(
    value ?? defaultValue ?? '',
  )

  if (keys.length !== 0 && isStringEmpty(defaultValue ?? '')) {
    setSelectedKey(keys[0])
  }

  if (selectedKey !== value) {
    setSelectedKey(value ?? '')
  }

  if (defaultValue && isStringEmpty(selectedKey) && !isStringEmpty(defaultValue)) {
    setSelectedKey(defaultValue)
  }

  const tabsContextValue = useMemo(() => {
    return {
      state: { defaultKey: defaultValue ?? selectedKey, selectedKey, keys, triggersData },
      dispatch: { setKeys, setSelectedKey, setTriggersData },
    } satisfies TabsContextState
  }, [selectedKey, keys, triggersData, defaultValue])

  return (
    <TabsContext.Provider
      value={tabsContextValue}
    >
      {children}
    </TabsContext.Provider>
  )
}

export const useTabContext = () => {
  const context = useContext(TabsContext)

  if (!context) {
    throw new Error('Should use context inside tabs')
  }

  return context
}
