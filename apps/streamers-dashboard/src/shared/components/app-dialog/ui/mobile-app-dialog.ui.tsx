import type { ReactNode } from 'react'

import { Text } from '~shared/components/typography'

import { Button } from 'klewik-ui/button'
import type { DrawerContentProps, DrawerProps } from 'klewik-ui/drawer'
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from 'klewik-ui/drawer'
import type { FlexProps } from 'klewik-ui/flex'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import type { SheetHeaderProps, SheetProps, SheetTriggerProps } from 'klewik-ui/sheet'
import { mergeProps } from 'klewik-ui/utils'

import { cn } from '~shared/utils'

export type MobileAppDialogProps = SheetProps

export const MobileAppDialog = (props: MobileAppDialogProps) => {
  return <Drawer side="bottom" size="full" {...props} />
}

MobileAppDialog.Trigger = MobileAppDialogTrigger
MobileAppDialog.Content = MobileAppDialogContent
MobileAppDialog.Header = MobileAppDialogHeader
MobileAppDialog.HeaderTitle = MobileAppDialogHeaderTitle
MobileAppDialog.ExtraActionsDialog = MobileAppDialogExtraActions
MobileAppDialog.HeaderActionsPanel = MobileAppDialogHeaderActionsPanel
MobileAppDialog.Footer = MobileAppDialogFooter

export type MobileAppDialogTriggerProps = SheetTriggerProps

function MobileAppDialogTrigger(props: MobileAppDialogTriggerProps) {
  return <DrawerTrigger {...props} />
}

export type MobileAppDialogContentProps = DrawerContentProps & {
  contentWrapperProps?: FlexProps<'div'>
}

function MobileAppDialogContent(props: MobileAppDialogContentProps) {
  const { contentWrapperProps, children, ...restProps } = props

  const mergedContentWrapperProps = mergeProps({
    className: 'h-full w-full',
    direction: 'column',
  }, contentWrapperProps)

  return (
    <DrawerContent
      slotClassnames={{ content: 'overflow-scroll p-4' }}
      {...restProps}
    >
      <Flex {...mergedContentWrapperProps}>{children}</Flex>
    </DrawerContent>
  )
}

export type MobileAppDialogHeaderProps = SheetHeaderProps

function MobileAppDialogHeader(props: MobileAppDialogHeaderProps) {
  const { className, ...restProps } = props

  return (
    <div
      className={cn('flex flex-row items-center w-full gap-x-4 px-2 py-1 mb-4 space-y-0', className)}
      {...restProps}
    />
  )
}

export type MobileAppDialogHeaderTitleProps = {
  value: string
  description?: string
  icon?: ReactNode
}

function MobileAppDialogHeaderTitle(props: MobileAppDialogHeaderTitleProps) {
  const { value, description, icon } = props

  return (
    <Flex className="flex gap-x-4 items-center">
      {icon}
      <div className="w-full">
        <DrawerTitle className="font-semibold">{value}</DrawerTitle>
        {description && (
          <DrawerDescription>
            <Text className="leading-4 font-normal text-gray-accent text-sm" asSpan>
              {description}
            </Text>
          </DrawerDescription>

        )}
      </div>
    </Flex>
  )
}

export type MobileAppDialogExtraActionsProps = DrawerProps & {
  children: ReactNode
}

function MobileAppDialogExtraActions(props: MobileAppDialogExtraActionsProps) {
  const { children, ...restProps } = props

  return (
    <Drawer side="bottom" {...restProps}>
      <DrawerTrigger render={<Button size="xs" startContent={<Icons.Actions />}>Действия</Button>} />
      <DrawerContent>
        <div className="py-3 px-4">
          <DrawerTitle>Действия</DrawerTitle>
        </div>
        <Flex className="gap-y-2 grow h-fit px-4 pb-4" direction="column">
          {children}
        </Flex>
      </DrawerContent>
    </Drawer>
  )
}

export type MobileAppDialogHeaderActionsPanelProps = FlexProps<'div'>

function MobileAppDialogHeaderActionsPanel(props: MobileAppDialogHeaderActionsPanelProps) {
  const { className, ...restProps } = props

  return <Flex className={cn('w-full gap-y-3 pb-4', className)} direction="column" {...restProps} />
}

export type MobileAppDialogFooterProps = FlexProps<'div'>

function MobileAppDialogFooter(props: MobileAppDialogFooterProps) {
  const { className, ...restProps } = props

  return <Flex className={cn('gap-y-2 pt-2', className)} direction="column" {...restProps} />
}
