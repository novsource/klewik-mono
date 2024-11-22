import { VariantProps, cva } from 'class-variance-authority'
import { ClassValue } from 'clsx'

type CvaClassValue = Omit<ClassValue, 'bigint'>

type CardVariants = {
  variant: {
    default: CvaClassValue
    slots: CvaClassValue
  }
  size: {
    default: CvaClassValue
    sm: CvaClassValue
    lg: CvaClassValue
  }
}

export const cardBaseVariants = cva<CardVariants>('bg-dark rounded-large', {
  variants: {
    variant: {
      default: 'text-white',
      slots: 'text-gray-accent font-semibold',
    },
    size: {
      default: 'px-5 py-4',
      sm: 'px-3 py-2',
      lg: 'rounded-lg px-8 py-6',
    },
  },
})

export const cardHeaderVariants = cva<CardVariants>('', {
  variants: {
    variant: { default: '', slots: '' },
    size: { default: 'pt-1', sm: '', lg: 'pt-4' },
  },
})

export const cardTitleVariants = cva<CardVariants>(
  'leading-none tracking-tight',
  {
    variants: {
      variant: { default: 'text-white', slots: 'text-gray-light' },
      size: {
        default: 'text-xl font-semibold',
        sm: 'text-sm font-semibold',
        lg: 'text-2xl font-semibold',
      },
    },
  }
)

export const cardContentVariants = cva<CardVariants>(
  'flex flex-col space-y-1.5',
  {
    variants: {
      variant: { default: '', slots: 'font-semibold text-base' },
      size: { default: 'py-4', sm: 'py-1', lg: 'py-6' },
    },
  }
)

export const cardDescriptionVariants = cva<CardVariants>(
  'text-sm text-muted-foreground',
  {
    variants: {
      variant: { default: '', slots: '' },
      size: { default: '', sm: '', lg: '' },
    },
  }
)

export const cardFooterVariants = cva<CardVariants>(
  'flex items-center p-6 pt-0',
  {
    variants: {
      variant: { default: '', slots: '' },
      size: { default: '', sm: '', lg: '' },
    },
  }
)

export type CardStyleProps = VariantProps<typeof cardBaseVariants>
