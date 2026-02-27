import { deleteAllSpacesFromString } from '../formatting'

export const isStringEmpty = (value: string) => {
  const trimmedString = deleteAllSpacesFromString(value)

  return trimmedString.length === 0
}
