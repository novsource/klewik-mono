import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

type TabsContext = {
  state: {
    defaultKey: string
    selectedKey: string
    keys: string[]
    triggersData: TriggersData
    isTriggerRunnerRended: boolean
  }
  dispatch: {
    setDefaultKey: Dispatch<SetStateAction<string>>
    setSelectedKey: Dispatch<SetStateAction<string>>
    setKeys: Dispatch<SetStateAction<string[]>>
    setTriggersData: Dispatch<SetStateAction<TriggersData>>
    setIsTriggerRunnerRended: Dispatch<SetStateAction<boolean>>
  }
}

type TabsContextProps = {
  defaultValue?: string
  children: JSX.Element
}

type TriggersData = {
  value: string
  width: number
  startX: number
}[]

export const TabsContext = createContext<NullablePossible<TabsContext>>(null)

export const TabsContextProvider = ({
  children,
  defaultValue,
}: TabsContextProps) => {
  const [keys, setKeys] = useState<string[]>([])
  const [defaultKey, setDefaultKey] = useState<string>(defaultValue ?? '')
  const [selectedKey, setSelectedKey] = useState<string>('')

  const [isTriggerRunnerRended, setIsTriggerRunnerRended] =
    useState<boolean>(false)

  const [triggersData, setTriggersData] = useState<TriggersData>([])

  useEffect(() => {
    if (keys.length !== 0 && defaultKey === '') {
      setDefaultKey(keys[0])
    }
  }, [keys])

  useEffect(() => {
    if (selectedKey === '' && defaultKey !== '') {
      setSelectedKey(defaultKey)
    }
  }, [defaultKey])

  return (
    <TabsContext.Provider
      value={{
        state: {
          isTriggerRunnerRended,
          defaultKey,
          selectedKey,
          keys,
          triggersData,
        },
        dispatch: {
          setKeys,
          setDefaultKey,
          setSelectedKey,
          setTriggersData,
          setIsTriggerRunnerRended,
        },
      }}
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
