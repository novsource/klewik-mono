import { Typography } from 'klewik-ui/typography'
import type { TypographyProps } from 'klewik-ui/typography'

export type TextProps = Omit<TypographyProps<'p'>, 'tag'> & {
  asSpan?: boolean
}

export const Text = (props: TextProps) => {
  const { asSpan = false, ...restProps } = props

  return <Typography tag={asSpan ? 'span' : 'p'} {...restProps} />
}
