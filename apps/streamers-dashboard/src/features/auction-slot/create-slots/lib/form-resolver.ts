import { FieldErrors, ResolverError, ResolverSuccess } from 'react-hook-form'

import { AuctionSlot } from '~entities/auction-slot/model'

import {
  deleteAllSpacesFromString,
  removeSpaceDuplicatingFromString,
} from '~shared/utils/string-format'

import { CreateSlotForm, createSlotSchema } from '../model'
import { TransformedCreateSlotsFormData } from './transform-form-data'

type CreateSlotsFormResolverReturnValue =
  | ResolverSuccess<TransformedCreateSlotsFormData>
  | ResolverError<CreateSlotForm>
type CreateSlotsFormZodResolver = (
  values: unknown
) => CreateSlotsFormResolverReturnValue

const zodFormValidation: CreateSlotsFormZodResolver = (values: unknown) => {
  const validationResult = createSlotSchema
    .transform<TransformedCreateSlotsFormData>((val) => {
      return val['slots'].map((slot) => ({
        ...slot,
        points: Number(deleteAllSpacesFromString(slot.points)),
      }))
    })
    .safeParse(values)

  if (!validationResult.success) {
    const formatedErrors = validationResult.error.errors.reduce<
      FieldErrors<CreateSlotForm>
    >(
      (acc, error) => {
        const fieldName = error.path[2]
        const fieldIndex = error.path[1]

        const fieldError = {
          [fieldIndex]: {
            [fieldName]: {
              message: error.message,
              type: 'custom',
            },
          },
        }

        acc['slots'] = { ...acc['slots'], ...fieldError }

        return acc
      },
      { slots: {} }
    )

    return { values: {}, errors: formatedErrors }
  }

  return { values: validationResult.data, errors: {} }
}

const checkSlotsNamesInFormFieldsOnDublicates: (
  validatedFormData: ResolverSuccess<TransformedCreateSlotsFormData>
) => CreateSlotsFormResolverReturnValue = (validatedFormData) => {
  const existedSlotsErrors = { slots: {} }

  const formSlotsArrLength = validatedFormData.values.length

  for (let index = 0; index < formSlotsArrLength; index++) {
    const slot = validatedFormData.values[index]
    const slicedArr = validatedFormData.values.slice(
      index + 1,
      formSlotsArrLength
    )

    // console.log(slicedArr, slot)

    const existedSlot = slicedArr.find(
      (item) =>
        removeSpaceDuplicatingFromString(item.name.toLowerCase().trim()) ===
        removeSpaceDuplicatingFromString(slot.name.toLowerCase().trim())
    )

    if (existedSlot) {
      existedSlotsErrors['slots'] = {
        ...existedSlotsErrors['slots'],
        ...{
          [index]: {
            name: {
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
  slots
) => {
  const slotsFromForm = validatedFormData.values

  const existedSlots = slotsFromForm.reduce<{
    [key: number]: TransformedCreateSlotsFormData[number]
  }>((acc, slot, index) => {
    const findedSlot = slots.find(
      (item) =>
        removeSpaceDuplicatingFromString(item.name.toLowerCase().trim()) ===
        removeSpaceDuplicatingFromString(slot.name.toLowerCase().trim())
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
        const fieldName = 'name'

        acc['slots'] = {
          ...acc['slots'],
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
      { slots: {} }
    )
    return { values: {}, errors }
  }

  return { values: slotsFromForm, errors: {} }
}

const createSlotsFormResolver = (slots: AuctionSlot[]) => (values: unknown) => {
  const validatedFormData = zodFormValidation(values)

  if (Object.keys(validatedFormData.errors).length !== 0)
    return validatedFormData

  const castFormData =
    validatedFormData as ResolverSuccess<TransformedCreateSlotsFormData>

  const formFieldDublicated =
    checkSlotsNamesInFormFieldsOnDublicates(castFormData)

  if (Object.keys(formFieldDublicated.errors).length !== 0)
    return formFieldDublicated

  return checkSlotsDublicated(castFormData, slots)
}

export { createSlotsFormResolver }
