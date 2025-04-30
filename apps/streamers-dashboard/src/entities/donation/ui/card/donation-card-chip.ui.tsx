import { ComponentProps, ReactNode } from 'react'

import { ClassValue } from 'clsx'

import { Flex } from '~shared/ui/flex'
import { Skeleton } from '~shared/ui/skeleton'
import { Typography } from '~shared/ui/typograghy'

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
        classNames?.base
      )}
      direction="row"
      align="center"
    >
      {startContent}
      <Typography
        className={cn(
          'font-golos-f text-md font-semibold text-gray-accent',
          classNames?.text
        )}
        tag="span"
      >
        {children}
      </Typography>
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
