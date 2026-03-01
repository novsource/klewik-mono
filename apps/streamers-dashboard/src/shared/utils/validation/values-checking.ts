export const isFunction = (target: unknown) => {
  return typeof target === 'function'
}

export const notUndefined = (value: unknown): boolean => {
  return value !== undefined
}

export const isStringEmpty = (str: string) => {
  const trimmedString = str.trim()

  return !trimmedString || trimmedString.length === 0
}

export const isError = (value: unknown): value is Error => {
  return value instanceof Error
}
