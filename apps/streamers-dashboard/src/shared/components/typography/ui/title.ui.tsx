import type { TypographyProps } from '~shared/ui/typograghy'
import { Typography } from '~shared/ui/typograghy'

export type TitleProps = Omit<TypographyProps<'h1'>, 'tag'> & {
  order?: 1 | 2 | 3
}

export const Title = (props: TitleProps) => {
  const { order = 1, ...restProps } = props

  return <Typography tag={`h${order}`} {...restProps} />
}
