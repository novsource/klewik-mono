import type { ReactNode } from 'react'

import { mergeProps } from '@base-ui/react'

import { Button } from '~shared/ui/button'
import type { FlexProps } from '~shared/ui/flex'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import type { SheetContentProps, SheetHeaderProps, SheetProps, SheetTriggerProps } from '~shared/ui/sheet'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '~shared/ui/sheet'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

export type MobileAppDialogProps = SheetProps

export const MobileAppDialog = (props: MobileAppDialogProps) => {
  return <Sheet {...props} />
}

export type MobileAppDialogTriggerProps = SheetTriggerProps

export const MobileAppDialogTrigger = (props: MobileAppDialogTriggerProps) => {
  return <SheetTrigger {...props} />
}

export type MobileAppDialogContentProps = Omit<SheetContentProps, 'isFullPageSize' | 'side'> & {
  contentWrapperProps?: FlexProps<'div'>
}

export const MobileAppDialogContent = (props: MobileAppDialogContentProps) => {
  const { className, contentWrapperProps, children, ...restProps } = props

  const mergedContentWrapperProps = mergeProps({
    className: 'h-full w-full',
    direction: 'column',
  }, contentWrapperProps)

  return (
    <SheetContent
      className={cn('overflow-scroll p-4', className)}
      isFullPageSize
      side="bottom"
      {...restProps}
    >
      <Flex {...mergedContentWrapperProps}>{children}</Flex>
    </SheetContent>
  )
}

export type MobileAppDialogHeaderProps = SheetHeaderProps

export const MobileAppDialogHeader = (props: MobileAppDialogHeaderProps) => {
  const { className, ...restProps } = props

  return (
    <SheetHeader
      className={cn('flex flex-row items-center w-full gap-x-4 px-2 py-1 mb-4 space-y-0', className)}
      {...restProps}
    />
  )
}

export type MobileAppDialogHeaderTitleProps = {
  title: string
  description?: string
  icon?: ReactNode
}

export const MobileAppDialogHeaderTitle = (props: MobileAppDialogHeaderTitleProps) => {
  const { title, description, icon } = props

  return (
    <>
      {icon}
      <div className="w-full">
        <SheetTitle>{title}</SheetTitle>
        {description && (
          <SheetDescription>
            <Typography
              className="leading-4 font-normal text-gray-accent text-sm"
              tag="p"
            >
              {description}
            </Typography>
          </SheetDescription>
        )}
      </div>
    </>
  )
}

export type MobileAppDialogExtraActionsProps = SheetProps & {
  children: ReactNode
}

export const MobileAppDialogExtraActions = (props: MobileAppDialogExtraActionsProps) => {
  const { children, ...restProps } = props

  return (
    <Sheet {...restProps}>
      <SheetTrigger className="text-gray-light" render={<Button size="xs" isIconOnly icon={<Icons.Dots size="xs" />} />} />
      <SheetContent
        className="w-full h-fit min-h-60 top-auto rounded-t-large border-t-1 border-t-dark-light gap-y-1.5"
        side="bottom"
        isFullPageSize
      >
        <Flex className="gap-y-2 mt-4" direction="column">
          {children}
        </Flex>
      </SheetContent>
    </Sheet>
  )
}

export type MobileAppDialogHeaderActionsPanelProps = FlexProps<'div'>

export const MobileAppDialogHeaderActionsPanel = (props: MobileAppDialogHeaderActionsPanelProps) => {
  const { className, ...restProps } = props

  return <Flex className={cn('w-full gap-y-3 pb-4', className)} direction="column" {...restProps} />
}

export type MobileAppDialogFooterProps = FlexProps<'div'>

export const MobileAppDialogFooter = (props: MobileAppDialogFooterProps) => {
  const { className, ...restProps } = props

  return <Flex className={cn('gap-y-2 pt-2', className)} direction="column" {...restProps} />
}
