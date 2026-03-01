export const swapArrayElements = (array: unknown[], indexOne: number, indexTwo: number) => {
  const isEmptyArray = array.length === 0
  if (isEmptyArray)
    return

  [array[indexOne], array[indexTwo]] = [array[indexTwo], array[indexOne]]
}
