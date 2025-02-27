import { VariantProps, cva } from 'class-variance-authority'

import { CvaClassValue } from '~shared/utils/types'

import { TypographyTags } from '../ui/typography'

type TypographyVariants = {
  tag: {
    [Tag in TypographyTags]: CvaClassValue
  }
}

export const typographyVariants = cva<TypographyVariants>('', {
  variants: {
    tag: {
      h1: 'text-title-lg font-bold leading-5 desktop:text-title-xl desktop-lg:text-[24px] desktop-lg:leading-7',
      h2: 'text-title-lg font-bold',
      h3: 'text-title font-semibold',
      h4: 'text-md font-semibold',
      span: 'text-md font-medium',
      p: 'text-md font-regular',
    },
  },
})

export type TypographyVariantsProps = VariantProps<typeof typographyVariants>
