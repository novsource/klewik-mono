import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import type { CvaClassValue } from '~shared/utils/types'

export type InputSlots
  = | 'base'
    | 'input'
    | 'wrapper'
    | 'content'
    | 'description'
    | 'label'
    | 'startContent'
    | 'endContent'

type ErrorCvaVariants = {
  isError: {
    [Bool in 'true' | 'false']: CvaClassValue
  }
}

type SizesCvaVariants = {
  size: {
    default: CvaClassValue
    sm: CvaClassValue
    lg: CvaClassValue
  }
}

type LabelVariants = SizesCvaVariants & ErrorCvaVariants
type DescriptionVariants = SizesCvaVariants & ErrorCvaVariants

type ContentBaseVariants = CvaClassValue
type ContentWrapperVariants = SizesCvaVariants
  & ErrorCvaVariants & {
    variant: {
      default: CvaClassValue
      ghost: CvaClassValue
    }
    isDisabled: {
      [Bool in 'true' | 'false']: CvaClassValue
    }
  }

type InputVariants = SizesCvaVariants
  & ErrorCvaVariants & {
    withLabel: {
      true: CvaClassValue
    }
    startContent: {
      true: CvaClassValue
    }
    endContent: {
      true: CvaClassValue
    }
  }

export const labelVariants = cva<LabelVariants>('select-none', {
  variants: {
    size: {
      default: 'text-sm tablet:text-md font-semibold font-superior',
      lg: 'text-sm tablet:text-md font-semibold font-superior',
      sm: 'text-xs tablet:text-sm font-medium font-superior',
    },
    isError: {
      true: 'text-red',
      false: 'text-white',
    },
  },
  defaultVariants: {
    size: 'default',
    isError: false,
  },
})

export const descriptionVariants = cva<DescriptionVariants>(
  'font-medium text-gray-accent',
  {
    variants: {
      size: {
        default: 'text-sm font-superior',
        lg: 'text-sm font-superior',
        sm: 'text-sm font-superior',
      },
      isError: {
        true: 'text-red',
        false: 'text-white',
      },
    },
    defaultVariants: {
      size: 'default',
      isError: false,
    },
  },
)

export const sidesSectionsVariants = cva<SizesCvaVariants>([
  'absolute top-1/2 -translate-y-1/2 flex justify-center items-center pointer-events-none',
  'data-[side=start]:left-0 data-[side=end]:right-0',
], {
  variants: {
    size: {
      default: 'size-9',
      sm: 'size-8',
      lg: 'size-10',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export const contentVariants = cva<ContentBaseVariants>([
  'group flex flex-col gap-y-1.25 tablet:gap-y-2',
])

export const contentWrapperVariants = cva<ContentWrapperVariants>(
  [
    'relative flex w-full items-center rounded-medium transition-all bg-dark',
    'ring-gray/70 data-[focus=true]:ring-1 data-[focus=true]:ring-gray/70',
  ],
  {
    variants: {
      variant: {
        default: 'border-1 border-dark-accent/70 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[focus=true]:bg-dark-foreground-light data-[hover=true]:bg-dark/50 data-[hover=true]:ring-1 data-[hover=true]:ring-gray/20',
        ghost: 'data-[focus=true]:bg-dark-foreground data-[hover=true]:bg-dark-foreground/40 data-[focus=true]:data-[hover=true]:bg-dark-foreground',
      },
      size: {
        default: 'h-10',
        sm: 'h-9',
        lg: 'h-11',
      },
      isError: { true: 'ring-1 ring-red/80', false: 'ring-gray-light' },
      isDisabled: {
        true: 'ring-0 data-[hover=true]:ring-0',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      isError: false,
      isDisabled: false,
    },
  },
)

export const inputVariants = cva<InputVariants>(
  [
    'flex h-full w-full items-center',
    'dark bg-transparent',
    'font-medium text-white caret-white',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-hidden',
    'placeholder:text-gray',
  ],
  {
    variants: {
      size: {
        default: 'text-md font-superior px-4',
        lg: 'text-md font-superior px-4',
        sm: 'text-sm font-superior px-3 py-2',
      },
      isError: {
        true: 'focus-visible:ring-red',
        false: 'focus-visible:ring-gray',
      },
      withLabel: {
        true: '',
      },
      startContent: {
        true: '',
      },
      endContent: {
        true: '',
      },
    },
    compoundVariants: [
      {
        startContent: true,
        endContent: false,
        size: 'default',
        className: 'pl-10',
      },
      {
        startContent: false,
        endContent: true,
        size: 'default',
        className: 'pr-10',
      },
      {
        startContent: true,
        endContent: true,
        size: 'default',
        className: 'px-10',
      },
      {
        startContent: true,
        endContent: false,
        size: 'sm',
        className: 'pl-8',
      },
      {
        startContent: false,
        endContent: true,
        size: 'sm',
        className: 'pr-8',
      },
      {
        startContent: true,
        endContent: true,
        size: 'sm',
        className: 'px-8',
      },
      {
        startContent: true,
        endContent: false,
        size: 'lg',
        className: 'pl-12',
      },
      {
        startContent: false,
        endContent: true,
        size: 'lg',
        className: 'pr-12',
      },
      {
        startContent: true,
        endContent: true,
        size: 'lg',
        className: 'px-12',
      },
    ],
    defaultVariants: {
      size: 'default',
      isError: false,
      startContent: false,
      endContent: false,
      withLabel: false,
    },
  },
)

export type InputVariantsProps = VariantProps<typeof inputVariants>
