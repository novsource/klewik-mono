import type { ReactNode } from 'react'

import { mergeProps } from '@base-ui/react'

import type { ButtonProps } from '~shared/ui/button'
import { Button } from '~shared/ui/button'
import type { FlexProps } from '~shared/ui/flex'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import type { SheetContentProps, SheetHeaderProps, SheetProps, SheetTriggerProps } from '~shared/ui/sheet'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '~shared/ui/sheet'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

export type DesktopAppDialogProps = SheetProps

export const DesktopAppDialog = (props: DesktopAppDialogProps) => {
  return <Sheet {...props} />
}

DesktopAppDialog.Content = DesktopAppDialogContent
DesktopAppDialog.Trigger = DesktopAppDialogTrigger
DesktopAppDialog.Header = DesktopAppDialogHeader
DesktopAppDialog.HeaderActionsPanel = DesktopAppDialogHeaderActionsPanel
DesktopAppDialog.TopPanel = DesktopAppDialogHeaderTopPanel
DesktopAppDialog.Title = DesktopAppDialogTitle
DesktopAppDialog.CloseButton = DesktopAppDialogClose

export type DesktopAppDialogContentProps = SheetContentProps & {
  contentWrapperProps?: Omit<FlexProps<'div'>, 'children'>
}

function DesktopAppDialogContent(props: DesktopAppDialogContentProps) {
  const { contentWrapperProps, children, ...restProps } = props

  const mergedContentWrapperProps = mergeProps({
    className: 'w-full h-full gap-y-4',
    direction: 'column',
    children,
  }, contentWrapperProps)

  return (
    <SheetContent {...restProps}>
      <Flex {...mergedContentWrapperProps} />
    </SheetContent>
  )
}

export type DesktopAppDialogTriggerProps = SheetTriggerProps

function DesktopAppDialogTrigger(props: DesktopAppDialogTriggerProps) {
  return <SheetTrigger {...props} />
}

export type DesktopAppDialogHeaderProps = SheetHeaderProps

function DesktopAppDialogHeader(props: SheetHeaderProps) {
  const { className, ...restProps } = props

  return (
    <SheetHeader className={cn('flex flex-col w-full gap-y-5', className)} {...restProps} />
  )
}

export type DesktopAppDialogCloseProps = ButtonProps

function DesktopAppDialogClose(props: DesktopAppDialogCloseProps) {
  const { className, ...restProps } = props

  return (
    <SheetClose className="relative right-0 top-0" nativeButton={false}>
      <Button
        className={cn('size-8', className)}
        isIconOnly
        icon={<Icons.LargeCross width={14} height={14} />}
        {...restProps}
      />
    </SheetClose>
  )
}

export type DesktopAppDialogHeaderTopPanelProps = FlexProps<'div'>

function DesktopAppDialogHeaderTopPanel(props: DesktopAppDialogHeaderTopPanelProps) {
  const { className, ...restProps } = props

  return <Flex className={cn('w-full h-8', className)} justify="between" {...restProps} />
}

export type DesktopAppDialogHeaderActionsPanelProps = FlexProps<'div'>

function DesktopAppDialogHeaderActionsPanel(props: DesktopAppDialogHeaderActionsPanelProps) {
  const { className, ...restProps } = props

  return <Flex className={cn('gap-x-2', className)} align="center" {...restProps} />
}

export type DesktopAppDialogTitleProps = FlexProps<'div'> & {
  title: string
  description?: string
  icon?: ReactNode
}

function DesktopAppDialogTitle(props: DesktopAppDialogTitleProps) {
  const { title, description, icon, className, ...restProps } = props

  return (
    <Flex className={cn('h-full gap-x-4', className)} align="center" {...restProps}>
      {icon}
      <Flex
        className="h-full"
        direction="column"
        align="start"
        justify="start"
      >
        <SheetTitle>{title}</SheetTitle>
        {description && (
          <SheetDescription>
            <Typography
              className="leading-4 font-normal text-gray-accent"
              tag="p"
            >
              {description}
            </Typography>
          </SheetDescription>
        )}
      </Flex>
    </Flex>
  )
}
