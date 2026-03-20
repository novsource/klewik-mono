import type { ProcessDonationForm } from '../model'

import type { ResolverError, ResolverSuccess } from 'react-hook-form'

import z from 'zod'

import { deleteAllSpacesFromString } from '~shared/utils'

import { ProcessDonationFormSchema, TransformedProcessDonationFormSchema } from '../model'

export type TransformedProcessDonationFormData = Omit<ProcessDonationForm, 'points'> & {
  points: number
}

type ProccessDonationFormResolverReturnValue = ResolverSuccess<TransformedProcessDonationFormData> | ResolverError<ProcessDonationForm>

export const processDonationFormResolver = (values: ProcessDonationForm): ProccessDonationFormResolverReturnValue => {
  const baseValidationResults = ProcessDonationFormSchema.transform<TransformedProcessDonationFormData>((value) => {
    return { ...value, points: Number(deleteAllSpacesFromString(value.points)) }
  }).safeParse(values)

  if (!baseValidationResults.success && baseValidationResults.error) {
    const treeifyedFormErrors = z.treeifyError(baseValidationResults.error)

    return {
      values: {},
      errors: {
        title: {
          type: 'validate',
          message: treeifyedFormErrors.properties?.title?.errors.join('; '),
        },
        points: {
          type: 'validate',
          message: treeifyedFormErrors.properties?.points?.errors.join('; '),
        },
      },
    }
  }

  const validationResults = TransformedProcessDonationFormSchema.safeParse(baseValidationResults.data)

  if (!validationResults.success && validationResults.error) {
    const treeifyedFormErrors = z.treeifyError(validationResults.error)

    return {
      values: {},
      errors: {
        title: {
          type: 'validate',
          message: treeifyedFormErrors.properties?.title?.errors.join('; '),
        },
        points: {
          type: 'validate',
          message: treeifyedFormErrors.properties?.points?.errors.join('; '),
        },
      },
    }
  }

  return { values: validationResults.data, errors: {} }
}
