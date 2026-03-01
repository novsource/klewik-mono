import type { HexColor, RGBAColor } from '~shared/lib/zod'

export const isHexColor = (str: string): str is HexColor => {
  if (str.length > 7 || str.length < 2 || str[0] !== '#') {
    return false
  }

  let isHexColor = true

  const strSlice = str.slice(1, str.length);

  [...strSlice].forEach((symbol) => {
    const numSym = Number(symbol)
    const isSymbolNumber = Number.isInteger(numSym)

    if (!isSymbolNumber) {
      const lowercasedSymbol = symbol.toLowerCase()
      const symbolCode = lowercasedSymbol.charCodeAt(0)

      if (symbolCode < 97 || symbolCode > 102) {
        isHexColor = false
      }
    }
  })

  return isHexColor
}

export const isRGBAColor = (str: string): str is RGBAColor => {
  const matchesArr = str.match(/\w\w/g)

  if (!matchesArr)
    return false

  return true
}
