import { cva } from 'class-variance-authority'

import type { ClassValue } from 'class-variance-authority/dist/types'

export type SelectSizes = {
  variant: {
    default: ClassValue
    ghost: ClassValue
  }
  size: {
    sm: ClassValue
    default: ClassValue
  }
}

export type SelectPositions = {
  position: {
    'item-aligned': ClassValue
    'popper': ClassValue
  }
}

type SelectTriggerSizes = SelectSizes

export const selectTriggerVariants = cva<SelectTriggerSizes>(
  [
    'flex w-fit items-center justify-between rounded-small border whitespace-nowrap transition-[color] outline-none',
    'hover:ring-gray/55 hover:bg-dark-accent/50 cursor-pointer',
    'border-dark-accent/70 data-[placeholder]:text-gray [&_svg:not([class*=\'text-\'])]:text-muted-foreground',
    'focus-visible:border-ring focus-visible:ring-gray-accent/80 aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
    'focus-visible:ring-[1px] disabled:cursor-not-allowed disabled:opacity-50',
    '*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:text-gray-light *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        default: 'bg-dark',
        ghost: 'bg-transparent',
      },
      size: {
        default:
          'h-9.5 px-3 py-2 text-md gap-2 [&_svg:not([class*=\'size-\'])]:size-4.5',
        sm: 'h-8 text-sm px-2 py-1 gap-1 [&_svg:not([class*=\'size-\'])]:size-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export const selectPositionerVariants = cva('outline-none z-10 user-select-none')

export const selectListVariants = cva([
  'relative overflow-y-auto',
  'max-h-[var(--available-height)]',
])

export const selectPopupVariants = cva(
  [
    'group bg-dark relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-[var(--transform-origin)] bg-clip-padding',
    'text-gray overflow-x-hidden overflow-y-auto rounded-md border border-dark-accent shadow-md',
    'data-[starting-style]:opacity-0 data-[starting-style]:scale-[0.9]',
    'data-[ending-style]:opacity-0 data-[ending-style]:scale-[0.9]',
  ],
  {
    variants: {
      position: {
        'item-aligned': '',
        'popper':
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
      },
    },
  },
)

type SelectItemVariants = SelectSizes

export const selectItemVariants = cva<SelectItemVariants>(
  [
    'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none cursor-pointer',
    'focus:bg-dark-accent focus:text-gray-accent [&_svg:not([class*=\'text-\'])]:text-gray-accent',
  ],
  {
    variants: {
      size: {
        sm: 'text-sm',
        default: 'text-md',
      },
      variant: {
        default: '',
        ghost: '',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

export const selectSeparatorVariants = cva(
  'bg-border pointer-events-none -mx-1 my-1 h-px',
)
export const selectScrollUpButtonVariants = cva(
  'flex cursor-default items-center justify-center py-1',
)

export const selectScrollDownButtonVariants = cva(
  'flex cursor-default items-center justify-center py-1',
)
