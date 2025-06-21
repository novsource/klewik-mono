import { useForm, useFormState } from 'react-hook-form'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { TransformedCreateSlotsFormData, createSlotsFormResolver } from '../lib'
import { CreateSlotForm } from '../model'

const DEFAULT_FORM_VALUE: CreateSlotForm['slots'][number] = {
  name: '',
  points: '1000',
}

const useCreateSlotsForm = () => {
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const formMethods = useForm<
    CreateSlotForm,
    unknown,
    TransformedCreateSlotsFormData
  >({
    defaultValues: { slots: [DEFAULT_FORM_VALUE] },
    resolver: createSlotsFormResolver(auctionSlots),
    reValidateMode: 'onChange',
    shouldFocusError: true,
  })

  const formState = useFormState({ control: formMethods.control })

  return { formMethods, formState }
}

export { useCreateSlotsForm }
