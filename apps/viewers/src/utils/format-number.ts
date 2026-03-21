type FormatNumberOptions = {
	locales?: Intl.LocalesArgument
	numberFormat?: Intl.NumberFormatOptions
}

export function formatNumberToIntlString(targetNumber: number, options?: FormatNumberOptions) {
	return Intl.NumberFormat(
		options?.locales ?? 'ru-RU',
		options?.numberFormat,
	).format(targetNumber)
}
