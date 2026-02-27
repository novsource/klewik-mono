export const isStringContainAnyNonDigit = (str: string) => {
  const pattern = /\D/g

  const regex = new RegExp(pattern)

  return !!str.match(regex)
}
