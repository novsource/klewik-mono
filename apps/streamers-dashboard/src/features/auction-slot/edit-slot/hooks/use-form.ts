import { useForm, useFormState } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { AuctionSlot } from '~entities/auction-slot/model'

import { formatNumberToIntlString } from '~shared/utils'

import { TransformedEditSlotFormData, transformEditSlotFormData } from '../lib'
import { EditSlotFormData } from '../model'

type UseEditSlotFormArgs = {
  defaultValues?: Pick<AuctionSlot, 'name' | 'points'>
  target: AuctionSlot
}

const useEditSlotForm = ({ defaultValues, target }: UseEditSlotFormArgs) => {
  const formMethods = useForm<
    EditSlotFormData,
    unknown,
    TransformedEditSlotFormData
  >({
    defaultValues: {
      name: defaultValues?.name ?? target.name,
      points: formatNumberToIntlString(defaultValues?.points ?? target.points),
    },
    resolver: zodResolver(transformEditSlotFormData()),
    mode: 'all',
    reValidateMode: 'onChange',
  })

  const formState = useFormState({ control: formMethods.control })

  return { formMethods, formState }
}

export { useEditSlotForm }
