import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'

import { EditSlotFormData } from '~features/auction-slot/edit-slot/model'

type ResponsiveEditSlotDialogContextState = {
  state: {
    isDialogOpen: boolean
    formInputState: NullablePossible<EditSlotFormData>
  }
  dispatch: {
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>
    setFormInputState: Dispatch<
      SetStateAction<NullablePossible<EditSlotFormData>>
    >
  }
}

const ResponsiveEditSlotDialogContext =
  createContext<ResponsiveEditSlotDialogContextState | null>(null)

const useResponsiveEditSlotDialogContext = () => {
  const context = useContext(ResponsiveEditSlotDialogContext)

  if (!context) {
    throw new Error('You should use context inside provider')
  }

  return context
}

type ResponsiveEditSlotDialogProviderProps = {
  isDialogOpen?: boolean
  children: ReactNode
}

const ResponsiveEditSlotDialogProvider = ({
  isDialogOpen,
  children,
}: ResponsiveEditSlotDialogProviderProps) => {
  const [isOpen, setIsOpen] = useState(isDialogOpen ?? false)
  const [formValues, setFormValues] =
    useState<NullablePossible<EditSlotFormData>>(null)

  const contextState = useMemo<ResponsiveEditSlotDialogContextState>(() => {
    console.log('here', isOpen)
    return {
      state: {
        isDialogOpen: isOpen,
        formInputState: formValues,
      },
      dispatch: {
        setIsDialogOpen: setIsOpen,
        setFormInputState: setFormValues,
      },
    }
  }, [isOpen, formValues])

  return (
    <ResponsiveEditSlotDialogContext.Provider value={contextState}>
      {children}
    </ResponsiveEditSlotDialogContext.Provider>
  )
}

export { ResponsiveEditSlotDialogProvider, useResponsiveEditSlotDialogContext }
