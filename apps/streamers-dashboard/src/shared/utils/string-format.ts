export const stringNumberFormat = (str: string) => {
  try {
    const value = Number.parseInt(str, 10)

    return new Intl.NumberFormat('ru-RU').format(value)
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message)
  }
}

export const isStringContainNotOnlyNumbers = (str: string) => {
  const pattern = /[^0-9.]/gm

  const regex = new RegExp(pattern)

  return !!str.match(regex)
}

export const deleteAllSpacesFromString = (str: string) => {
  return [...str].filter((sym) => !sym.match(/(?<=\s)/)).join('')
}

export const removeSpaceDuplicatingFromString = (str: string) => {
  return str.replace(/\s\s+/g, ' ')
}
