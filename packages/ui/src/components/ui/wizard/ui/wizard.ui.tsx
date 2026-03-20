'use client'

import type {
  WizardContextProviderProps,
} from '../context'

import type { ComponentPropsWithRef, ReactNode } from 'react'

import { cn } from '~utils/index'
import { chain } from '~utils/index'

import {
  useWizardContext,
  WizardContextProvider,
} from '../context'

export type WizardProps = ComponentPropsWithRef<'div'>
  & Omit<WizardContextProviderProps, 'children'>

const Wizard = (props: WizardProps) => {
  const { wizardMap, initialStepId, className, ...restProps } = props

  return (
    <WizardContextProvider wizardMap={wizardMap} initialStepId={initialStepId}>
      <div data-slot="wizard-base" className={cn(className)} {...restProps} />
    </WizardContextProvider>
  )
}

export type WizardItemProps = ComponentPropsWithRef<'div'> & {
  value: string
  children: ReactNode | ((nodes: string[]) => ReactNode)
}

const WizardItem = (props: WizardItemProps) => {
  const { value, className, children, ...restProps } = props

  const { currentStepId, getNodesById } = useWizardContext()

  const isNeedToRender = currentStepId === value

  return (
    isNeedToRender && (
      <div
        data-slot="wizard-item"
        data-step-id={value}
        className={cn(className)}
        {...restProps}
      >
        {typeof children === 'function'
          ? children(getNodesById(value) ?? [])
          : children}
      </div>
    )
  )
}

type WizardTriggerProps = ComponentPropsWithRef<'div'> & {
  type: 'back' | 'next' | 'reset'
  nextStepId?: string
}

const WizardTrigger = (props: WizardTriggerProps) => {
  const { type, className, nextStepId, onClick, ...restProps } = props

  const { back, next, reset } = useWizardContext()

  const handleOnClick = () => {
    switch (type) {
      case 'next': {
        if (nextStepId)
          next(nextStepId)
        break
      }
      case 'back': {
        back()
        break
      }
      case 'reset': {
        reset()
      }
    }
  }

  return (
    <div
      data-slot="wizard-trigger"
      data-trigger-type={type}
      data-next-id={nextStepId ?? null}
      onClick={onClick ? chain(handleOnClick, onClick) : handleOnClick}
      {...restProps}
    />
  )
}

export { Wizard, WizardItem, WizardTrigger }
