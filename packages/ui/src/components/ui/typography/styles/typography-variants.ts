import type { VariantProps } from 'class-variance-authority'

import type { TypographyTags } from '../ui/typography.ui'

import { cva } from 'class-variance-authority'

import type { ClassValue } from 'class-variance-authority/dist/types'

type TypographyVariants = {
  tag: {
    [Tag in TypographyTags]: ClassValue
  }
}

export const typographyVariants = cva<TypographyVariants>('', {
  variants: {
    tag: {
      h1: 'font-golos-f text-title-lg font-bold leading-5 desktop:text-title-xl desktop-lg:text-title-2xl desktop-lg:leading-7',
      h2: 'font-golos-f text-[18.5px] tablet:text-title-lg font-bold',
      h3: 'font-golos-f text-title font-semibold',
      h4: 'font-golos-f text-md font-semibold',
      span: 'font-golos-f text-md font-medium leading-4 tablet:leading-5',
      p: 'font-golos-f text-md font-regular leading-4 tablet:leading-5',
    },
  },
})

export type TypographyVariantsProps = VariantProps<typeof typographyVariants>
