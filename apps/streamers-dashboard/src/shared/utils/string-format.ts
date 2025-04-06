import { formatNumberToIntlString } from './number-format'

type StringNumberFormatOptions = {
  locales?: Intl.LocalesArgument
  numberFormat?: Intl.NumberFormatOptions
}

export const stringNumberFormat = (
  str: string,
  options?: StringNumberFormatOptions
) => {
  try {
    const value = Number.parseInt(str, 10)

    return formatNumberToIntlString(value, options)
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message)
  }
}

export const isStringContainNotOnlyDigits = (str: string) => {
  const pattern = /[^0-9]/gm

  const regex = new RegExp(pattern)

  return !!str.match(regex)
}

export const deleteAllSpacesFromString = (str: string) => {
  return [...str].filter((sym) => !sym.match(/(?<=\s)/)).join('')
}

export const removeSpaceDuplicatingFromString = (str: string) => {
  return str.replace(/\s\s+/g, ' ')
}
