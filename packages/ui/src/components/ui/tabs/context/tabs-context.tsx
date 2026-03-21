import type { TabsStylesProps } from '../styles/tabs-variants'

import type {
  Dispatch,
  JSX,
  SetStateAction,
} from 'react'
import {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'

import { isStringEmpty } from '../../../../utils/index'

type TabsContextState = {
  state: {
    defaultKey: string
    selectedKey: string
    keys: string[]
    triggersData: NullablePossible<TriggersData>
  }
  dispatch: {
    setSelectedKey: Dispatch<SetStateAction<string>>
    setKeys: Dispatch<SetStateAction<string[]>>
    setTriggersData: Dispatch<SetStateAction<NullablePossible<TriggersData>>>
  }
  styles: TabsStylesProps
}

type TabsContextProps = TabsStylesProps & {
  value?: string
  defaultValue?: string
  children: JSX.Element
}

type TriggersData = Record<string, {
  width: number
  height: number
  startY: number
  startX: number
}>

export const TabsContext = createContext<NullablePossible<TabsContextState>>(null)

export const TabsContextProvider = ({
  children,
  defaultValue,
  value,
  variant = 'default',
  orientation = 'horizontal',
}: TabsContextProps) => {
  const [triggersData, setTriggersData] = useState<NullablePossible<TriggersData>>(null)
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
      state: {
        defaultKey: defaultValue ?? selectedKey,
        selectedKey,
        keys,
        triggersData,
      },
      dispatch: { setKeys, setSelectedKey, setTriggersData },
      styles: { variant, orientation },
    } satisfies TabsContextState
  }, [selectedKey, keys, triggersData, defaultValue, variant, orientation])

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
