import type { TransformedEditSlotFormData } from '../lib'
import type { EditSlotFormData } from '../model'

import { useForm, useFormState } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import type { AuctionSlot } from '~entities/auction-slot/model'

import { formatNumberToIntlString } from '~shared/utils'

import { transformEditSlotFormData } from '../lib'

type UseEditSlotFormArgs = {
  defaultValues?: Pick<AuctionSlot, 'title' | 'points'>
  target: AuctionSlot
}

const useEditSlotForm = ({ defaultValues, target }: UseEditSlotFormArgs) => {
  const formMethods = useForm<
    EditSlotFormData,
    unknown,
    TransformedEditSlotFormData
  >({
    defaultValues: {
      title: defaultValues?.title ?? target.title,
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
