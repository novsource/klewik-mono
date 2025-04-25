import { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardProps } from '~shared/ui/card'
import { Flex } from '~shared/ui/flex'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

type ProcessDonationCardProps = CardProps & {
  title: string
  titleIcon?: ReactNode
  contentPosition?: 'right' | 'bottom'
}

const ProcessDonationCard = (props: ProcessDonationCardProps) => {
  const {
    title,
    titleIcon,
    contentPosition = 'right',
    children,
    ...cardProps
  } = props

  return (
    <Card
      className={cn(
        'p-3 rounded-medium',
        contentPosition === 'right' &&
          'flex flex-row justify-between items-center'
      )}
      {...cardProps}
    >
      <CardHeader className="p-0">
        <Flex className="gap-x-1.5" align="center">
          {titleIcon}
          <Typography className="text-sm text-gray-accent" tag="span">
            {title}
          </Typography>
        </Flex>
      </CardHeader>
      <CardContent
        className={cn(
          'py-0 pt-1.5 font-golos-f text-md font-medium',
          contentPosition === 'right' && 'pt-0'
        )}
      >
        {children}
      </CardContent>
    </Card>
  )
}

export { ProcessDonationCard }
