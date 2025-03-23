import { ComponentProps } from 'react'

import { Flex } from '~shared/ui/flex'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

type SettingsAreaProps = ComponentProps<'div'> & {
  title: string
  description?: string
}

const SettingsArea = ({
  title,
  description,
  children,
  className,
  ...otherProps
}: SettingsAreaProps) => {
  return (
    <Flex
      className={cn('gap-y-10', className)}
      direction="column"
      justify="center"
      {...otherProps}
    >
      <Flex className="gap-y-7" direction="column">
        <Flex className="w-full" justify="between">
          <Flex className="w-full max-w-[400px] gap-y-1" direction="column">
            <Typography className="font-golos-f" tag="h3">
              {title}
            </Typography>
            {description && (
              <Typography className="text-gray-accent font-golos-f" tag="p">
                {description}
              </Typography>
            )}
          </Flex>
          {children}
        </Flex>
      </Flex>
    </Flex>
  )
}

const SettingsAreasDivider = () => {
  return <div className="w-full h-0.5 bg-dark" />
}

export { SettingsArea, SettingsAreasDivider }
