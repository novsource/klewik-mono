import type { ClassValue } from 'clsx'

import type { ComponentProps, ReactNode } from 'react'

import { Flex } from '~shared/ui/flex'
import { Skeleton } from '~shared/ui/skeleton'

import { cn } from '~shared/utils'

type DonationCardChipProps = {
  children: ReactNode
  startContent?: JSX.Element
  endContent?: JSX.Element
  classNames?: {
    base?: ClassValue
    text?: ClassValue
  }
}

const DonationCardChip = (props: DonationCardChipProps) => {
  const { children, startContent, endContent, classNames } = props

  return (
    <Flex
      className={cn(
        'px-2 py-1 bg-dark-accent gap-x-1 rounded-md',
        classNames?.base,
      )}
      align="center"
      justify="center"
    >
      {startContent}
      {children}
      {endContent}
    </Flex>
  )
}

const SkeletonDonationCardChip = ({
  className,
  ...props
}: ComponentProps<'div'>) => {
  return (
    <Skeleton className={cn('w-20 h-7 rounded-md', className)} {...props} />
  )
}

export { DonationCardChip, SkeletonDonationCardChip }
