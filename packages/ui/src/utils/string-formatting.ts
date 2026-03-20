export const deleteAllSpacesFromString = (str: string) => {
  return [...str].filter(sym => !sym.match(/(?<=\s)/)).join('')
}

export const removeSpaceDuplicatingFromString = (str: string) => {
  return str.replace(/\s{2,}/g, ' ')
}
