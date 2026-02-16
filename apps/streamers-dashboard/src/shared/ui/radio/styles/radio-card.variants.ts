import { cva } from 'class-variance-authority'

export const radioCardVariants = cva([
  'w-full flex flex-row justify-between pt-1.5 pb-0.5',
  'hover:outline-1 outline-dark-accent',
  'active:outline-gray/80',
  'transition-[outline]',
  'group-data-[disabled]:opacity-50 group-data-[disabled]:cursor-default group-data-[disabled]:hover:outline-none',
])
