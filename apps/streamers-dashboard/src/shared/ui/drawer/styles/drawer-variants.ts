import { VariantProps, cva } from 'class-variance-authority'

const drawerOverlayVariants = cva([
  'dark fixed inset-0 z-50 bg-black/50 blur:2 backdrop-blur-xs',
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
])

const drawerContentVariants = cva(
  [
    'group/drawer-content bg-dark-foreground fixed z-50 flex flex-col border-dark-accent',
    'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0',
    'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 ',
    'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0',
    'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0',
  ],
  {
    variants: {
      isFullPageHeight: {
        true: [
          'h-full',
          'data-[vaul-drawer-direction=top]:max-h-[100vh]',
          'data-[vaul-drawer-direction=bottom]:max-h-[100vh]',
          'data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:mobile:max-w-full',
          'data-[vaul-drawer-direction=left]:w-full data-[vaul-drawer-direction=left]:mobile:max-w-full',
        ],
        false: [
          'h-auto',
          'data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-large data-[vaul-drawer-direction=top]:border-b',
          'data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-large data-[vaul-drawer-direction=bottom]:border-t',
          'data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:mobile:max-w-sm',
          'data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:mobile:max-w-sm',
        ],
      },
    },
    defaultVariants: {
      isFullPageHeight: false,
    },
  }
)

const drawerPillVariants = cva(
  'bg-gray mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block'
)

const drawerHeaderVariants = cva(['flex flex-col gap-1.5 p-4'])
const drawerFooterVariants = cva(['mt-auto flex flex-col gap-2 p-4'])

const drawerTitleVariants = cva('text-white font-semibold')

const drawerDescriptionVariants = cva('text-gray-light text-sm')

export type DrawerContentVariantsProps = VariantProps<
  typeof drawerContentVariants
>
export {
  drawerTitleVariants,
  drawerPillVariants,
  drawerFooterVariants,
  drawerHeaderVariants,
  drawerContentVariants,
  drawerOverlayVariants,
  drawerDescriptionVariants,
}
