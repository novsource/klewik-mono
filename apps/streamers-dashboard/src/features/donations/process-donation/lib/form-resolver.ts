import type { ProcessDonationForm } from '../model'

import { deleteAllSpacesFromString } from '~shared/utils'

import { ProcessDonationFormSchema } from '../model'

export type TransformedProcessDonationFormData = Omit<ProcessDonationForm, 'points'> & {
  points: number
}

export const processDonationFormResolver = () => {
  return ProcessDonationFormSchema.transform<TransformedProcessDonationFormData>((value) => {
    return { ...value, points: Number(deleteAllSpacesFromString(value.points)) }
  })
}
