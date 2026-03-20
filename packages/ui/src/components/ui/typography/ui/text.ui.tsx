import { Typography } from './typography.ui'
import type { TypographyProps } from './typography.ui'

export type TextProps = Omit<TypographyProps<'p'>, 'tag'> & {
  asSpan?: boolean
}

export const Text = (props: TextProps) => {
  const { asSpan = false, ...restProps } = props

  return <Typography tag={asSpan ? 'span' : 'p'} {...restProps} />
}
