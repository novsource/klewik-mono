const isStringEmpty = (str: string) => {
  const trimmedString = str.trim()

  return !trimmedString || trimmedString.length === 0
}

export { isStringEmpty }
