import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import type { ClassValue } from 'class-variance-authority/dist/types'

type CardVariants = {
  variant: {
    default: ClassValue
    slots: ClassValue
  }
  size: {
    default: ClassValue
    sm: ClassValue
    lg: ClassValue
  }
}

export const cardBaseVariants = cva<CardVariants>('bg-dark rounded-large', {
  variants: {
    variant: {
      default: 'text-white',
      slots: 'text-gray-accent font-semibold',
    },
    size: {
      default: 'px-4 py-3',
      sm: 'px-3 py-2',
      lg: 'rounded-lg px-8 py-6',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
})

export const cardHeaderVariants = cva<CardVariants>('', {
  variants: {
    variant: { default: '', slots: '' },
    size: { default: 'pt-1', sm: '', lg: 'pt-4' },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
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
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  },
)

export const cardContentVariants = cva<CardVariants>(
  'flex flex-col space-y-1.5',
  {
    variants: {
      variant: { default: '', slots: 'font-semibold text-base' },
      size: { default: 'py-2', sm: 'pt-1', lg: 'py-4' },
    },
  },
)

export const cardDescriptionVariants = cva<CardVariants>(
  'text-sm text-muted-foreground',
  {
    variants: {
      variant: { default: '', slots: '' },
      size: { default: '', sm: '', lg: '' },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  },
)

export const cardFooterVariants = cva<CardVariants>('flex items-center pt-0', {
  variants: {
    variant: { default: '', slots: '' },
    size: { default: '', sm: '', lg: '' },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
})

export type CardStyleProps = VariantProps<typeof cardBaseVariants>
