import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import type { CvaClassValue } from '~shared/utils/types'

type TabsVariant = 'default' | 'bottomLine'

type TabsCvaVariants = {
  variant: {
    [Variant in TabsVariant]: CvaClassValue
  }
}

export const tabsListVariants = cva<TabsCvaVariants>(
  'relative inline-flex h-9 tablet:h-10 items-center rounded-large p-1',
  {
    variants: {
      variant: {
        default: 'bg-dark',
        bottomLine: '',
      },
    },
  },
)

export const tabsTriggerVariants = cva<TabsCvaVariants>([
  'z-10 inline-flex items-center justify-center whitespace-nowrap cursor-pointer',
  'ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50',
  'px-3 py-1.5 max-tablet:px-2.5 max-tablet:py-1',
  'text-gray-light font-medium text-md max-tablet:text-sm',
  'transition-all data-[state=active]:cursor-default',
], {
  variants: {
    variant: {
      default: 'data-[state=active]:text-white data-[state=active]:shadow-sm hover:text-gray-accent rounded-sm',
      bottomLine: 'data-[state=active]:text-green-accent hover:text-gray-accent',
    },
  },
})

export const tabsContentVariants = cva(
  'mt-2 ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
)

export const tabsTriggerRunnerVariants = cva<TabsCvaVariants>(
  'absolute transition-all',
  {
    variants: {
      variant: {
        default: 'h-8 max-tablet:h-7.5 rounded-medium bg-dark-accent tabs-runner-shadow border-1 border-gray/20',
        bottomLine: 'h-0.75 bg-green-accent/80 rounded-t-pill bottom-0',
      },
    },
  },
)

export type TabsStylesProps = VariantProps<typeof tabsTriggerRunnerVariants>
