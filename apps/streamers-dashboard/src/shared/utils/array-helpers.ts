export const swapArrayElements = (array: unknown[], indexOne: number, indexTwo: number) => {
  const isEmptyArray = array.length === 0
  if (isEmptyArray)
    return

  [array[indexOne], array[indexTwo]] = [array[indexTwo], array[indexOne]]
}

export function shuffleArray<T>(array: T[]): T[]
export function shuffleArray<T, Return extends boolean>(array: T[], inPlace: Return): Return extends true ? void : T[]
export function shuffleArray<T>(array: T[], inPlace?: boolean) {
  const isEmptyArray = array.length === 0
  if (isEmptyArray)
    return

  const targetArray = inPlace ? array : [...array]

  targetArray.forEach((_, index) => {
    const randomIndex = Math.floor(Math.random() * (array.length - 1))

    swapArrayElements(targetArray, index, randomIndex)
  })

  if (inPlace)
    return

  return targetArray
}
