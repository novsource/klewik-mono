import type { VariantProps } from 'class-variance-authority'

import type { TypographyTags } from '../ui/typography'

import { cva } from 'class-variance-authority'

import type { CvaClassValue } from '~shared/utils/types'

type TypographyVariants = {
  tag: {
    [Tag in TypographyTags]: CvaClassValue
  }
}

export const typographyVariants = cva<TypographyVariants>('', {
  variants: {
    tag: {
      h1: 'font-breeze text-title-lg font-bold leading-5 desktop:text-title-xl desktop-lg:text-[24px] desktop-lg:leading-7',
      h2: 'font-breeze text-title-lg font-bold',
      h3: 'font-breeze text-title font-semibold',
      h4: 'font-breeze text-md font-semibold',
      span: 'font-breeze text-md font-medium leading-4',
      p: 'font-golos-f text-md font-regular leading-5',
    },
  },
})

export type TypographyVariantsProps = VariantProps<typeof typographyVariants>
