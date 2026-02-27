type FormatNumberToIntlStringOptions = {
  locales?: Intl.LocalesArgument
  numberFormat?: Intl.NumberFormatOptions
}

export const formatNumberToIntlString = (target: number, options?: FormatNumberToIntlStringOptions) => {
  return Intl.NumberFormat(
    options?.locales ?? 'ru-RU',
    options?.numberFormat,
  ).format(target)
}
