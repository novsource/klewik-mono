export const getRandomRGBColor = () => {
  return `rgb(${Math.random() * 255},${Math.random() * 255},${
    Math.random() * 255
  })`
}

export const getRandomHEXColor = () => {
  return `#${Math.floor(16777215 * Math.random()).toString(16)}`
}

export const getRandomHSLColor = () => {
  return 'hsl(' + 360 * Math.random() + ',40%,48%)'
}
