import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import type { CvaClassValue } from '~shared/lib/cva'

export type DrawerSide = 'bottom' | 'right'
export type DrawerSize = 'full' | 'default'

type DrawerSideVariants = {
  side: Record<DrawerSide, CvaClassValue>
}

type DrawerSizeVariants = {
  size: Record<DrawerSize, CvaClassValue>
}

export const drawerBackdropVariants = cva([
  'dark fixed inset-0 min-h-dvh bg-black/60',
  '[--backdrop-opacity:0.2] [--bleed:3rem] dark:[--backdrop-opacity:0.7] opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] supports-[-webkit-touch-callout:none]:absolute',
  'data-[swiping]:duration-0 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)]',
])

export const drawerViewportVariants = cva<DrawerSideVariants>([
  'fixed inset-0 flex',
], {
  variants: {
    side: {
      right: [
        'items-stretch justify-end',
        'p-[var(--viewport-padding)] [--viewport-padding:0px] supports-[-webkit-touch-callout:none]:[--viewport-padding:0.625rem]',
      ],
      bottom: 'items-end justify-center',
    },
  },
  defaultVariants: {
    side: 'right',
  },
})

export const drawerPopupVariants = cva<DrawerSideVariants & DrawerSizeVariants>([
  'text-gray-900',
  'outline-1 outline-dark-light overflow-y-auto overscroll-contain touch-auto',
  'transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)]',
  'data-[swiping]:select-none data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)]',
], {
  variants: {
    size: {
      full: '',
      default: '',
    },
    side: {
      right: [
        'bg-dark-foreground p-6 rounded-small',
        'landtop:max-w-[500px] desktop:max-w-[550px] tablet:max-w-[450px]',
        '[transform:translateX(var(--drawer-swipe-movement-x))] data-[ending-style]:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)))] data-[starting-style]:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)))]',
        '[--bleed:3rem] supports-[-webkit-touch-callout:none]:[--bleed:0px]',
        'supports-[-webkit-touch-callout:none]:mr-0 supports-[-webkit-touch-callout:none]:w-[20rem] supports-[-webkit-touch-callout:none]:max-w-[calc(100vw-20px)] supports-[-webkit-touch-callout:none]:rounded-[10px] supports-[-webkit-touch-callout:none]:pr-6',
      ],
      bottom: [
        'pt-3 outline-dark-accent bg-dark-foreground px-6',
      ],
    },
  },
  compoundVariants: [{
    size: 'default',
    side: 'right',
    className: '-mr-[3rem] w-3/4 max-w-[calc(100vw-3rem+3rem)] pr-[calc(1.5rem+3rem)] h-full',
  }, {
    size: 'full',
    side: 'right',
    className: 'w-full h-full',
  }, {
    size: 'default',
    side: 'bottom',
    className: '-mb-[3rem] w-full max-h-[calc(80vh+3rem)] rounded-t-[24px] pb-[calc(1.5rem+env(safe-area-inset-bottom,0px)+3rem)] [transform:translateY(var(--drawer-swipe-movement-y))] data-[ending-style]:[transform:translateY(calc(100%-3rem))] data-[starting-style]:[transform:translateY(calc(100%-3rem))]',
  }, {
    size: 'full',
    side: 'bottom',
    className: 'w-full h-full pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] [transform:translateY(var(--drawer-swipe-movement-y))] data-[ending-style]:[transform:translateY(100%)] data-[starting-style]:[transform:translateY(100%)]',
  }],
  defaultVariants: {
    side: 'right',
    size: 'default',
  },
})

const drawerContentVariants = cva('mx-auto w-full max-w-[32rem]')

const drawerPillVariants = cva(
  'mx-auto mt-4 hidden h-1 w-12 shrink-0 rounded-full bg-gray group-data-[vaul-drawer-direction=bottom]/drawer-content:block',
)

const drawerHeaderVariants = cva(['flex flex-col gap-1.5 p-4'])
const drawerFooterVariants = cva(['mt-auto flex flex-col gap-2 p-4'])

const drawerTitleVariants = cva('font-semibold text-white')

const drawerDescriptionVariants = cva('text-sm text-gray-light')

export type DrawerPopupVariantsProps = VariantProps<
  typeof drawerPopupVariants
  >

export type DrawerViewportVariantsProps = VariantProps<typeof drawerViewportVariants>

export {
  drawerContentVariants,
  drawerDescriptionVariants,
  drawerFooterVariants,
  drawerHeaderVariants,
  drawerPillVariants,
  drawerTitleVariants,
}
