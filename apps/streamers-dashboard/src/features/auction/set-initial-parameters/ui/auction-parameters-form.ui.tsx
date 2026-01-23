import type { FormEvent } from 'react'

import { cn } from '~shared/utils'

import { useAuctionInitialParametersForm } from '../hooks/use-form'
import { AuctionInitialParametersFormComposer as FormComposer } from './form-composer.ui'

type AuctionInitialParametersFormProps = {
  className?: string
  onSuccess?: () => void
  onError?: () => void
}

export function AuctionInitialParametersForm(props: AuctionInitialParametersFormProps) {
  const { onError, onSuccess, className } = props

  const { form, state, submitForm, submitQueryState } = useAuctionInitialParametersForm({ onError, onSuccess })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!state.isValid || !state.isDirty)
      return

    submitForm()
  }

  const isSubmitButtonDisabled = submitQueryState.isLoading || !state.isValid || !state.isDirty

  return (
    <FormComposer
      className={cn('flex w-full h-full gap-y-6 flex-col', className)}
      form={form}
      onSubmit={handleSubmit}
    >
      <FormComposer.AuctionTitleField />

      <FormComposer.SubmitButton
        className="w-full"
        disabled={isSubmitButtonDisabled}
      >
        Сохранить и создать аукцион
      </FormComposer.SubmitButton>
    </FormComposer>
  )
}
