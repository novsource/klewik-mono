import { deleteAllSpacesFromString } from "./string-formatting"


export const isStringEmpty = (value: string) => {
  const trimmedString = deleteAllSpacesFromString(value)

  return trimmedString.length === 0
}
