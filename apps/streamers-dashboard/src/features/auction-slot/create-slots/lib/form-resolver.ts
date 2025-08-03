import type { CreateSlotForm } from '../model'
import type { TransformedCreateSlotsFormData } from './transform-form-data'

import type { FieldErrors, ResolverError, ResolverSuccess } from 'react-hook-form'

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
    .transform<TransformedCreateSlotsFormData>((val) => {
      const transformedValuesArray = val.slots.map(slot => ({
        ...slot,
        points: typeof slot.points === 'number' ? slot.points : Number(deleteAllSpacesFromString(slot.points)),
      }))

      return { slots: transformedValuesArray }
    })
    .safeParse(values)

  if (!validationResult.success) {
    const formatedErrors = validationResult.error.errors.reduce<
      FieldErrors<CreateSlotForm>
    >(
      (acc, error) => {
        const fieldIndex = Number(error.path[1])
        const fieldName = error.path[2]

        const fieldError = {
          [fieldName]: {
            message: error.message,
            type: error.code,
          },
        }

        if (acc.slots && !acc.slots[fieldIndex]) {
          acc.slots[fieldIndex] = fieldError
        }

        if (acc.slots && acc.slots[fieldIndex]) {
          acc.slots[fieldIndex] = { ...acc.slots[fieldIndex], ...fieldError }
        }

        return acc
      },
      { slots: {} },
    )

    return { values: {}, errors: formatedErrors }
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

const createSlotsFormResolver = (slots: AuctionSlot[]) => (values: unknown) => {
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

export { createSlotsFormResolver }
