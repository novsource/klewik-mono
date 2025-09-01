export const isFunction = (target: unknown) => {
  return typeof target === 'function'
}

export const notUndefined = (value: unknown) => {
  return value !== undefined
}

export const isStringEmpty = (str: string) => {
  const trimmedString = str.trim()

  return !trimmedString || trimmedString.length === 0
}

export const isStringContainNotOnlyDigits = (str: string) => {
  const pattern = /\D/g

  const regex = new RegExp(pattern)

  return !!str.match(regex)
}
