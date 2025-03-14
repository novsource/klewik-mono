import { cva } from 'class-variance-authority'

const commandVariants = cva(
  'bg-dark text-white flex h-full w-full flex-col overflow-hidden rounded-md'
)

const commandInputVariants = cva(
  'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50'
)

const commandListVariants = cva(
  'max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto'
)

const commandGroupVariants = cva(
  'text-gray [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium'
)

const commandItemVariants = cva(
  "data-[selected=true]:bg-dark-accent data-[selected=true]:text-gray-accent [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
)

const commandShortcutVariants = cva(
  'text-muted-foreground ml-auto text-xs tracking-widest'
)

export {
  commandVariants,
  commandInputVariants,
  commandListVariants,
  commandGroupVariants,
  commandItemVariants,
  commandShortcutVariants,
}
