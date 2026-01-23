import { cva } from 'class-variance-authority'

export const radioCardVariants = cva([
  'w-full flex flex-row justify-between pt-1.5 pb-0.5',
  'hover:outline-1 outline-dark-accent',
  'active:outline-gray/80',
  'checked:bg-red',
  'transition-[outline]',
])
