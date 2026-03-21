export const tailwindScreens = {
	smallMobile: '320px',
	mobile: '640px',
	tablet: '1024px',
	landtop: '1440px',
	desktop: '1920px',
	desktopLg: '2560px',
} as const

type DevicesMediaQueries = Record<keyof typeof tailwindScreens, string>

export const greaterThenDeviceWidthMediaQueries: DevicesMediaQueries = {
	smallMobile: `(min-width: ${tailwindScreens.smallMobile})`,
	mobile: `(min-width: ${tailwindScreens.smallMobile})`,
	tablet: `(min-width: ${tailwindScreens.tablet})`,
	landtop: `(min-width: ${tailwindScreens.landtop})`,
	desktop: `(min-width: ${tailwindScreens.desktop})`,
	desktopLg: `(min-width: ${tailwindScreens.desktop})`,
}
