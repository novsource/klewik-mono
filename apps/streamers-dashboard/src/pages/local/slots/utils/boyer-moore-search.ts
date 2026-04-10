export const boyerMooreSearch = (text: string, pattern: string) => {
  const textLength = text.length
  const patternLength = pattern.length
  if (patternLength === 0)
    return 0

  const shiftTable: Record<string, number> = {}

  for (let index = 0; index < patternLength - 1; index++) {
    shiftTable[pattern[index]] = patternLength - 1 - index
  }

  let shift = 0
  while (shift <= (textLength - patternLength)) {
    let index = patternLength - 1

    while (index >= 0 && pattern[index] === text[shift + index]) {
      index--
    }

    if (index < 0) {
      return shift
    }
    else {
      const charAtMismatch = text[shift + patternLength - 1]
      shift += shiftTable[charAtMismatch] || patternLength
    }
  }
  return -1
}
