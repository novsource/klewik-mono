import { ReactNode, createContext, useContext } from 'react'

import { useWizard } from '~hooks/index'

type WizardContextState = ReturnType<typeof useWizard>

export type WizardContextProviderProps = {
  children: ReactNode
  wizardMap: Parameters<typeof useWizard>[0]
  initialStepId?: Parameters<typeof useWizard>[1]
}

const WizardContext = createContext<NullablePossible<WizardContextState>>(null)

export const WizardContextProvider = ({
  children,
  ...wizardProps
}: WizardContextProviderProps) => {
  const wizard = useWizard(wizardProps.wizardMap, wizardProps.initialStepId)

  return (
    <WizardContext.Provider value={wizard}>{children}</WizardContext.Provider>
  )
}

export const useWizardContext = () => {
  const context = useContext(WizardContext)

  if (!context) {
    throw new Error('You should use wizard context inside provider')
  }

  return context
}
