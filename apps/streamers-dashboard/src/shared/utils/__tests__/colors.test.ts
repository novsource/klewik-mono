import {
  getRandomHEXColor,
  getRandomHSLColor,
  getRandomRGBColor,
} from '~shared/utils/colors'

describe('#colors utils', () => {
  it('should return correct random RGB color', () => {
    const rgb = getRandomRGBColor()

    expect(rgb).toContain('rgb(')

    const rgbValues = rgb.replace('rgb(', '').replace(')', '').split(',')

    expect(rgbValues.length).toBeGreaterThanOrEqual(3)
    expect(rgbValues.length).toBeLessThanOrEqual(4)

    rgbValues.forEach((val) => expect(Number(val)).not.toBe(NaN))
    rgbValues.forEach((val) => expect(Number(val)).toBeGreaterThanOrEqual(0))
    rgbValues.forEach((val) => expect(Number(val)).toBeLessThanOrEqual(255))
  })

  it('should return correct random HEX color', () => {
    const hex = getRandomHEXColor()

    expect(hex[0]).toBe('#')

    const hexValues = hex.slice(1, hex.length)

    // Hex length - from 3 to 6
    expect(hexValues.length).toBeGreaterThanOrEqual(3)
    expect(hexValues.length).toBeLessThanOrEqual(6)

    expect(hexValues).not.toMatch(/([d-z][D-Z])/gm)
    expect(hexValues).not.toMatch(/w/gm)
  })

  it('should return correct random HSL color', () => {
    const hsl = getRandomHSLColor()

    expect(hsl).toContain('hsl(')

    const hslValues = hsl.replace('hsl(', '').replace(')', '').split(',')

    expect(hslValues.length).toBe(3)

    hslValues.forEach((val) =>
      expect(Number(val.replace('%', ''))).not.toBe(NaN)
    )

    expect(Number(hslValues[0])).toBeGreaterThanOrEqual(0)
    expect(Number(hslValues[0])).toBeLessThanOrEqual(360)
  })
})
