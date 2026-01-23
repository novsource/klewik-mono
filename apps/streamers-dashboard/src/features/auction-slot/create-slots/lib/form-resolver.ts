import type { CreateSlotForm } from '../model'
import type { TransformedCreateSlotsFormData } from './transform-form-data'

import type { FieldError, FieldErrors, ResolverError, ResolverSuccess } from 'react-hook-form'

import z from 'zod'

import type { AuctionSlot } from '~entities/auction-slot/model'

import {
  deleteAllSpacesFromString,
  removeSpaceDuplicatingFromString,
} from '~shared/utils/string-format'

import { createSlotSchema } from '../model'

type CreateSlotsFormResolverReturnValue
  = | ResolverSuccess<TransformedCreateSlotsFormData>
    | ResolverError<CreateSlotForm>
type CreateSlotsFormZodResolver = (
  values: unknown
) => CreateSlotsFormResolverReturnValue

const zodFormValidation: CreateSlotsFormZodResolver = (values: unknown) => {
  const validationResult = createSlotSchema
    .transform<TransformedCreateSlotsFormData>((value) => {
      const transformedValuesArray: TransformedCreateSlotsFormData['slots'] = value.slots.map(slot => ({
        ...slot,
        points: typeof slot.points === 'number' ? slot.points : Number(deleteAllSpacesFromString(slot.points)),
      }))

      return { slots: transformedValuesArray }
    })
    .safeParse(values)

  if (!validationResult.success && validationResult.error) {
    const errors = z.treeifyError(validationResult.error)

    if (!errors.properties?.slots?.items) {
      return { values: {}, errors: {} }
    }

    const slotsErrorItems = errors.properties.slots.items

    const formattedErrors = slotsErrorItems.reduce((acc, curr, index) => {
      const tabFieldsErrors = curr.properties!

      const formattedFields = (Object.keys(tabFieldsErrors) as Array<keyof typeof tabFieldsErrors>).reduce((acc, fieldName) => {
        const fieldErrorValue = tabFieldsErrors[fieldName]

        acc[fieldName] = {
          type: 'validate',
          message: fieldErrorValue?.errors.join('; '),
        }

        return acc
      }, {} as Record<keyof typeof tabFieldsErrors, FieldError>)

      if (acc.slots) {
        acc.slots[index] = formattedFields
      }

      return acc
    }, { slots: {} } as FieldErrors<CreateSlotForm>)

    return { values: {}, errors: formattedErrors }
  }

  return { values: validationResult.data, errors: {} }
}

const checkSlotsNamesOnDublicates: (
  validatedFormData: ResolverSuccess<TransformedCreateSlotsFormData>
) => CreateSlotsFormResolverReturnValue = (validatedFormData) => {
  const { values: { slots } } = validatedFormData
  const existedSlotsErrors = { slots: {} }

  const formSlotsArrLength = validatedFormData.values.slots.length

  for (let index = 0; index < formSlotsArrLength; index++) {
    const slot = slots[index]
    const slicedArr = slots.slice(
      index + 1,
      formSlotsArrLength,
    )

    const existedSlot = slicedArr.find(
      item =>
        removeSpaceDuplicatingFromString(item.title.toLowerCase().trim())
        === removeSpaceDuplicatingFromString(slot.title.toLowerCase().trim()),
    )

    if (existedSlot) {
      existedSlotsErrors.slots = {
        ...existedSlotsErrors.slots,
        ...{
          [index]: {
            title: {
              message: 'Слот с таким именем уже есть в форме',
              type: 'custom',
            },
          },
        },
      }
    }
  }

  return Object.keys(existedSlotsErrors.slots).length !== 0
    ? { values: {}, errors: existedSlotsErrors }
    : { values: validatedFormData.values, errors: {} }
}

type CheckSlotsOnDublicates = (
  validatedFormData: ResolverSuccess<TransformedCreateSlotsFormData>,
  slots: AuctionSlot[]
) => CreateSlotsFormResolverReturnValue

const checkSlotsDublicated: CheckSlotsOnDublicates = (
  validatedFormData,
  slots,
) => {
  const slotsFromForm = validatedFormData.values.slots

  const existedSlots = slotsFromForm.reduce<{
    [key: number]: TransformedCreateSlotsFormData['slots'][number]
  }>((acc, slot, index) => {
    const findedSlot = slots.find(
      item =>
        removeSpaceDuplicatingFromString(item.title.toLowerCase().trim())
        === removeSpaceDuplicatingFromString(slot.title.toLowerCase().trim()),
    )

    if (findedSlot) {
      acc[index] = findedSlot
    }

    return acc
  }, {})

  if (Object.keys(existedSlots).length !== 0) {
    const errors = Object.keys(existedSlots).reduce<
      FieldErrors<CreateSlotForm>
    >(
      (acc, key) => {
        const fieldName = 'title'

        acc.slots = {
          ...acc.slots,
          ...{
            [key]: {
              [fieldName]: {
                message: 'Этот слот уже участвует в аукционе',
                type: 'custom',
              },
            },
          },
        }

        return acc
      },
      { slots: {} },
    )
    return { values: {}, errors }
  }

  return { values: { slots: slotsFromForm }, errors: {} }
}

export const createSlotsFormResolver = (slots: AuctionSlot[]) => (values: unknown) => {
  const validatedFormData = zodFormValidation(values)

  if (Object.keys(validatedFormData.errors).length !== 0)
    return validatedFormData

  const castFormData
    = validatedFormData as ResolverSuccess<TransformedCreateSlotsFormData>

  const formFieldDublicated
    = checkSlotsNamesOnDublicates(castFormData)

  if (Object.keys(formFieldDublicated.errors).length !== 0)
    return formFieldDublicated

  return checkSlotsDublicated(castFormData, slots)
}
