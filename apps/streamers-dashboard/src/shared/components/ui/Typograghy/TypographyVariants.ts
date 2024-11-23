import { CvaClassValue } from '@/shared/utils/types'
import { VariantProps, cva } from 'class-variance-authority'

type TypographyVariants = {
  tag: {
    h1: CvaClassValue
    h2: CvaClassValue
    h3: CvaClassValue
    h4: CvaClassValue
    span: CvaClassValue
    p: CvaClassValue
  }
}

export const typographyVariants = cva<TypographyVariants>('', {
  variants: {
    tag: {
      h1: 'text-titleXL font-bold leading-5 2xl:text-[24px] 2xl:leading-7',
      h2: 'text-title font-bold',
      h3: 'text-title font-semibold',
      h4: 'text-md font-semibold',
      span: 'text-md font-medium',
      p: 'text-md font-regular',
    },
  },
})

export type TypographyVariantsProps = VariantProps<typeof typographyVariants>
