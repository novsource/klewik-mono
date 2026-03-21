import { cva } from 'class-variance-authority'

import type { ClassValue } from 'class-variance-authority/dist/types'

export type TextAreaSize = 'sm' | 'md' | 'lg'

export type TextAreaStylesVariants = {
  size: {
    [Size in TextAreaSize]: ClassValue
  }
}

export const textAreaVariants = cva<TextAreaStylesVariants>([
  'w-full h-full resize-none',
  'placeholder:text-gray',
  'focus-visible:outline-0',
], {
  variants: {
    size: {
      sm: 'p-0.75 text-base',
      md: 'p-3 text-lg',
      lg: 'px-2 py-1 text-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const textAreaWrapperVariants = cva('relative flex flex-col text-white w-full h-full')

export type TextAreaContentStylesVariants = {
  isError: {
    [Bool in 'true' | 'false']: ClassValue
  }
}

export const textAreaContentVariants = cva<TextAreaContentStylesVariants>([
  'inline-block bg-dark w-full h-full overflow-hidden',
  'rounded-small has-focus-visible:bg-dark/40 transition-all outline-1',
], {
  variants: {
    isError: {
      true: 'outline-red',
      false: 'outline-dark-accent has-focus-visible:outline-1 has-focus:outline-gray',
    },
  },
  defaultVariants: {
    isError: false,
  },
})

export const textAreaNoteVariants = cva<TextAreaContentStylesVariants>(
  'inline-block w-full h-fit pt-2 text-sm text-right tablet:text-md',
  {
    variants: {
      isError: {
        true: 'text-red',
        false: 'text-gray-accent',
      },
    },
    defaultVariants: {
      isError: false,
    },
  },
)
