import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'

type SliderKeys = string[]

type SliderContext<Keys extends SliderKeys = SliderKeys> = {
  state: {
    keys: Keys
    selectedKey: Keys[number]
    defaultKey: Keys[number]
  }
  func: {
    setKeys: Dispatch<SetStateAction<Keys>>
    setSelectedKey: Dispatch<SetStateAction<Keys[number]>>
  }
}

export type SliderContextProps<Keys extends SliderKeys = SliderKeys> = {
  children: ReactNode
  selectedKey?: Keys[number]
  defaultKey?: Keys[number]
  keys: Keys
}

const SliderContext = createContext<NullablePossible<SliderContext>>(null)

export const SliderProvider = ({
  children,
  defaultKey,
  ...props
}: SliderContextProps) => {
  const [keys, setKeys] = useState<string[]>(props.keys || [''])
  const [selectedKey, setSelectedKey] = useState<string>(defaultKey || keys[0])

  return (
    <SliderContext.Provider
      value={{
        state: { keys: keys, selectedKey, defaultKey: keys[0] },
        func: { setKeys, setSelectedKey },
      }}
    >
      {children}
    </SliderContext.Provider>
  )
}

export const useSliderContext = () => {
  const sliderContext = useContext(SliderContext)

  if (sliderContext === null) {
    throw Error('You should use hook inside Slider component')
  }

  return sliderContext
}
