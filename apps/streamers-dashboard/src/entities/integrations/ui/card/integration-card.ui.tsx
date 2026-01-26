import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import type { IntegrationsPlatforms } from '~entities/integrations/model'

import type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
} from '~shared/ui/card'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~shared/ui/card'
import { Icons } from '~shared/ui/icons'

import { cn } from '~shared/utils'

// <Card className="bg-dark/70 max-w-[350px]">
//   <CardHeader className="flex w-full justify-between items-center">
//     {integrationIcon}
//     {integrationButton}
//   </CardHeader>
//   <CardContent>
//     <Typography tag="span" className="text-title font-bold">
//       {integrationPlatformName}
//     </Typography>
//     {description && (
//       <Typography tag="p" className="text-gray-accent">
//         {description}
//       </Typography>
//     )}
//   </CardContent>
//   <CardFooter className="bg-dark">
//   </CardFooter>
// </Card>

const integrationsIcons: Record<IntegrationsPlatforms, NullablePossible<ReactNode>> = {
  donationAlerts: <Icons.DonationAlerts width={24} height={28} />,
  donatePay: <Icons.DonatePay width={32} height={32} />,
  twitch: <Icons.TwitchLogo />,
  custom: null,
} as const

export type BaseIntegrationCardProps = CardProps

export const BaseIntegrationCard = (props: BaseIntegrationCardProps) => {
  const { className, ...restProps } = props

  return <Card className={cn('bg-dark/60 max-w-[350px] p-0', className)} {...restProps} />
}

export type BaseIntegrationCardHeaderProps = CardHeaderProps

export const BaseIntegrationCardHeader = (props: BaseIntegrationCardHeaderProps) => {
  const { className, ...restProps } = props

  return <CardHeader className={cn('flex flex-col gap-y-2 w-full justify-between items-start px-4 pt-4', className)} {...restProps} />
}

export type BaseIntegrationCardContentProps = CardContentProps

export const BaseIntegrationCardContent = (props: BaseIntegrationCardContentProps) => {
  const { className, ...restProps } = props

  return <CardContent className={cn('px-4 py-3 gap-y-1 space-y-0', className)} {...restProps} />
}

export type BaseIntegrationCardTitleProps = CardTitleProps

export const BaseIntegrationCardTitle = (props: BaseIntegrationCardTitleProps) => {
  const { className, ...restProps } = props

  return <CardTitle className={cn('text-title font-bold', className)} {...restProps} />
}

export type BaseIntegrationCardDescriptionProps = CardDescriptionProps

export const BaseIntegrationCardDescription = (props: BaseIntegrationCardDescriptionProps) => {
  const { className, ...restProps } = props

  return <CardDescription className={cn('text-gray-accent', className)} {...restProps} />
}

export type BaseIntegrationCardFooterProps = CardFooterProps

export const BaseIntegrationCardFooter = (props: BaseIntegrationCardFooterProps) => {
  const { className, ...restProps } = props

  return <CardFooter className={cn('px-4 py-1.5 rounded-b-medium', className)} {...restProps} />
}

export type BaseIntegrationCardPlatformIconProps = ComponentPropsWithoutRef<'div'> & {
  platform: IntegrationsPlatforms
}

export const BaseIntegrationCardPlatformIcon = (props: BaseIntegrationCardPlatformIconProps) => {
  const { className, platform, ...restProps } = props

  return <div className={className} {...restProps}>{ integrationsIcons[platform] }</div>
}
