import type { EditSlotFormData } from '../model'
import type { TransformedEditSlotFormData } from './resolve-transformer'

import type { ResolverError, ResolverOptions, ResolverSuccess } from 'react-hook-form'

import z from 'zod'

import { deleteAllSpacesFromString } from '~shared/utils'

import { EditSlotFormSchema, TransformedEditSlotFormSchema } from '../model'

type EditSlotFormResolverReturnValue = ResolverSuccess<TransformedEditSlotFormData> | ResolverError<EditSlotFormData>

export const editSlotFormResolver = (values: EditSlotFormData, _: ResolverOptions<EditSlotFormData>): EditSlotFormResolverReturnValue => {
  const baseValidationResults = EditSlotFormSchema.transform<TransformedEditSlotFormData>((value) => {
    return { title: value.title.trim(), points: Number(deleteAllSpacesFromString(value.points)) }
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

  const validationResults = TransformedEditSlotFormSchema.safeParse(baseValidationResults.data)

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
