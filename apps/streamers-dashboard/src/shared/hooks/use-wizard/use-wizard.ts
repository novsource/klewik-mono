import { useMemo, useState } from 'react'

export type WizardItem<StepId> = {
  id: StepId
  nodes?: Array<StepId>
}

const useWizard = <WizardId extends string>(
  initialWizardMap: WizardItem<WizardId>[],
  initialStepId?: WizardId,
) => {
  const initialStep = initialStepId ?? initialWizardMap[0].id

  const [currentStepId, setCurrentStepId] = useState(initialStep)
  const [history, setHistory] = useState<WizardId[]>([currentStepId])

  const wizardMap = useMemo(
    () =>
      new Map(
        initialWizardMap.map(wizardItem => [wizardItem.id, wizardItem]),
      ),
    [initialWizardMap],
  )

  const next = (id: WizardId) => {
    const isPossibleToTravel = !!wizardMap
      .get(currentStepId)
      ?.nodes
      ?.find(wizardId => id === wizardId)

    if (!isPossibleToTravel) {
      throw new Error('You can\'t go this id from current id')
    }

    setCurrentStepId(id)
    setHistory(curr => [...curr, id])
  }

  const back = () => {
    if (history.length < 2)
      return

    setCurrentStepId(() => history[history.length - 2])
    setHistory(curr => [...curr.slice(0, curr.length - 1)])
  }

  const reset = () => {
    setCurrentStepId(initialStep)
    setHistory([initialStep])
  }

  return {
    currentStepId,
    history,
    next,
    back,
    reset,
    getNodesById: (id: WizardId) => wizardMap.get(id)?.nodes,
  }
}

export { useWizard }
