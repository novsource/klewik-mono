import type { ReactNode } from 'react'

import type { CardProps } from '~shared/ui/card'
import { Card, CardContent, CardHeader } from '~shared/ui/card'
import { Flex } from '~shared/ui/flex'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

type ProcessDonationCardProps = CardProps & {
  title: string
  titleIcon?: ReactNode
  contentPosition?: 'right' | 'bottom'
}

export const ProcessDonationCard = (props: ProcessDonationCardProps) => {
  const {
    title,
    titleIcon,
    contentPosition = 'right',
    children,
    className,
    ...cardProps
  } = props

  return (
    <Card
      className={cn(
        'px-2 pt-1.5 pb-2 tablet:p-3 rounded-medium',
        contentPosition === 'right'
        && 'flex flex-row justify-between items-center',
        className,
      )}
      {...cardProps}
    >
      <CardHeader className="p-0">
        <Flex className="gap-x-1.5" align="center">
          {titleIcon}
          <Typography className="text-sm text-gray-light font-golos-f font-medium" tag="span">
            {title}
          </Typography>
        </Flex>
      </CardHeader>
      <CardContent
        className={cn(
          'py-0 pt-0.75 tablet:pt-1.5 font-golos-f tablet:text-md font-medium text-white/80 text-sm max-tablet:pl-1',
          contentPosition === 'right' && 'tablet:pt-0 max-tablet:pl-0',
        )}
      >
        {children}
      </CardContent>
    </Card>
  )
}
