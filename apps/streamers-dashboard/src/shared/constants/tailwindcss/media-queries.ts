import { tailwindScreens } from './twScreens'

type DevicesMediaQueries = Record<keyof typeof tailwindScreens, string>

export const devicesMediaQuries: DevicesMediaQueries = {
  smallMobile: `(max-width: ${tailwindScreens.mobile})`,
  mobile: `(min-width: ${tailwindScreens.mobile}) and (max-width: ${tailwindScreens.tablet})`,
  tablet: `(min-width: ${tailwindScreens.tablet}) and (max-width: ${tailwindScreens.landtop})`,
  landtop: `(min-width: ${tailwindScreens.landtop}) and (max-width: ${tailwindScreens.desktop})`,
  desktop: `(min-width: ${tailwindScreens.desktop}) and (max-width: ${tailwindScreens.desktopLg})`,
  desktopLg: `(min-width: ${tailwindScreens.desktop})`,
} as const

export const greaterThenDeviceWidthMediaQueries: DevicesMediaQueries = {
  smallMobile: `(min-width: ${tailwindScreens.smallMobile})`,
  mobile: `(min-width: ${tailwindScreens.mobile})`,
  tablet: `(min-width: ${tailwindScreens.tablet})`,
  landtop: `(min-width: ${tailwindScreens.landtop})`,
  desktop: `(min-width: ${tailwindScreens.desktop})`,
  desktopLg: `(min-width: ${tailwindScreens.desktop})`,
}
