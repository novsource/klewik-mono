import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import type { ButtonProps } from 'klewik-ui/button'
import { Button } from 'klewik-ui/button'
import type { DrawerContentProps, DrawerProps, DrawerTriggerProps } from 'klewik-ui/drawer'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from 'klewik-ui/drawer'
import type { FlexProps } from 'klewik-ui/flex'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import { Text } from 'klewik-ui/typography'
import { mergeProps } from 'klewik-ui/utils'

import { cn } from '~shared/utils'

export type DesktopAppDialogProps = DrawerProps

export const DesktopAppDialog = (props: DesktopAppDialogProps) => {
  return <Drawer {...props} />
}

DesktopAppDialog.Content = DesktopAppDialogContent
DesktopAppDialog.Trigger = DesktopAppDialogTrigger
DesktopAppDialog.Header = DesktopAppDialogHeader
DesktopAppDialog.HeaderActionsPanel = DesktopAppDialogHeaderActionsPanel
DesktopAppDialog.TopPanel = DesktopAppDialogHeaderTopPanel
DesktopAppDialog.Title = DesktopAppDialogTitle
DesktopAppDialog.CloseButton = DesktopAppDialogClose

export type DesktopAppDialogContentProps = DrawerContentProps & {
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
    <DrawerContent {...restProps}>
      <Flex {...mergedContentWrapperProps} />
    </DrawerContent>
  )
}

export type DesktopAppDialogTriggerProps = DrawerTriggerProps

function DesktopAppDialogTrigger(props: DesktopAppDialogTriggerProps) {
  return <DrawerTrigger {...props} />
}

export type DesktopAppDialogHeaderProps = ComponentPropsWithoutRef<'div'>

function DesktopAppDialogHeader(props: DesktopAppDialogHeaderProps) {
  const { className, ...restProps } = props

  return (
    <div className={cn('flex flex-col w-full gap-y-5', className)} {...restProps} />
  )
}

export type DesktopAppDialogCloseProps = ButtonProps

function DesktopAppDialogClose(props: DesktopAppDialogCloseProps) {
  const { className, ...restProps } = props

  return (
    <DrawerClose
      className="relative right-0 top-0"
      nativeButton={false}
      type="button"
      render={(
        <Button
          className={cn('size-8', className)}
          isIconOnly
          icon={<Icons.LargeCross width={14} height={14} />}
          {...restProps}
        />
      )}
    />
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
        <DrawerTitle className="text-title">{title}</DrawerTitle>
        {description && (
          <DrawerDescription>
            <Text className="leading-4 font-normal text-gray-accent">
              {description}
            </Text>
          </DrawerDescription>
        )}
      </Flex>
    </Flex>
  )
}
