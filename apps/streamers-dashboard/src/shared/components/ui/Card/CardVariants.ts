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

export const cardBaseVariants = cva<CardVariants>('rounded-lg bg-dark', {
  variants: {
    variant: {
      default: 'text-white-smooth',
      slots: 'text-dark-accent',
    },
    size: {
      default: 'rounded-md',
      sm: 'rounded-sm',
      lg: 'rounded-lg',
    },
  },
})

export const cardHeaderVariants = cva<CardVariants>('pt-6', {
  variants: {
    variant: { default: '', slots: '' },
    size: { default: '', sm: '', lg: '' },
  },
})

export const cardTitleVariants = cva<CardVariants>(
  'text-2xl font-semibold leading-none tracking-tight',
  {
    variants: {
      variant: { default: '', slots: '' },
      size: { default: '', sm: '', lg: '' },
    },
  }
)

export const cardContentVariants = cva<CardVariants>(
  'flex flex-col space-y-1.5 p-6',
  {
    variants: {
      variant: { default: '', slots: '' },
      size: { default: '', sm: '', lg: '' },
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
