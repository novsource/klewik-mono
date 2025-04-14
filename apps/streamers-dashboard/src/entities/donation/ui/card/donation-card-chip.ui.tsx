import { ReactNode } from 'react'

import { ClassValue } from 'clsx'

import { Flex } from '~shared/ui/flex'
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
        'px-1.5 py-1 bg-gray/30 gap-x-0.5 rounded-md',
        classNames?.base
      )}
      direction="row"
      align="center"
    >
      {startContent}
      <Typography
        className={cn(
          'font-golos-f text-sm font-semibold text-gray-accent',
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

export { DonationCardChip }
