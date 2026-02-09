export type SortingDrawerStylesSlots = 'header' | 'headerTitleWrapper' | 'title' | 'content' | 'contentItem' | 'footer' | 'footerResetButton' | 'footerActionButton'

export const sortingDrawerStyles: Record<SortingDrawerStylesSlots, string> = {
  header: /* tw */ 'flex-row justify-between items-center',
  headerTitleWrapper: /* tw */ 'gap-x-2 text-gray-accent',
  title: /* tw */ 'text-gray-accent font-medium text-md',
  content: /* tw */ 'bg-transparent',
  contentItem: /* tw */ 'text-md px-4 text-gray',
  footer: /* tw */ 'w-full flex-row',
  footerResetButton: /* tw */ 'w-full',
  footerActionButton: /* tw */ 'w-full',
}
