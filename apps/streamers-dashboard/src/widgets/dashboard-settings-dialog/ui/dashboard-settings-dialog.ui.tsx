import type { ComponentPropsWithoutRef } from 'react'

import { useCurrentEditor } from '@tiptap/react'
import { AuctionTextRulesWysiwygEditorDialog } from '~features/settings/set-text-rules/ui'

import { globalDialogsActions, globalDialogsSelectors } from '~app/components/global-dialogs/store/global-dialogs.slice'

import { DonatePayIntegrationCard } from '~features/integrations/connect-integration/ui/donate-pay'
import { DonationAlertsIntegrationCard } from '~features/integrations/connect-integration/ui/donation-alerts'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalHeaderTitle,
} from '~shared/components/modal'
import { Text, Title } from '~shared/components/typography'

import { useMediaQuery } from '~shared/hooks'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Divider } from '~shared/ui/divider'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { ScrollArea } from '~shared/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~shared/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~shared/ui/tabs'

import { cn } from '~shared/utils'

import { DeleteAuctionDialog } from './dialogs/delete-auction-dialog.ui'

type AuctionSettingsDialogProps = ComponentPropsWithoutRef<'div'>

export const AuctionSettingsDialog = (props: AuctionSettingsDialogProps) => {
  const isMediaLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  if (isMediaLargeThenTablet) {
    return <DesktopSettingsDialog {...props} />
  }

  return <MobileSettingsDialog {...props} />
}

type DesktopSettingsDialogProps = ComponentPropsWithoutRef<'div'>

function DesktopSettingsDialog(props: DesktopSettingsDialogProps) {
  const { className, ...restProps } = props

  const { isOpen } = useStoreSelector(state => globalDialogsSelectors.getDialogState(state, 'settings'))

  const { setDialogOpenStatus } = useActionCreators(globalDialogsActions)

  const handleOnOpenChange = (open: boolean) => {
    setDialogOpenStatus({ dialog: 'settings', status: open })
  }

  const closeDialog = () => setDialogOpenStatus({ dialog: 'settings', status: false })

  return (
    <Modal open={isOpen} onOpenChange={handleOnOpenChange} {...restProps}>
      <ModalContent>
        <ModalHeader>
          <ModalHeaderTitle>Настройки</ModalHeaderTitle>
          <ModalCloseButton />
        </ModalHeader>

        <Flex className="grow h-full py-2">
          <SettingsTabs />
        </Flex>

      </ModalContent>
    </Modal>
  )
}

type MobileSettingsDialogProps = ComponentPropsWithoutRef<'div'>

function MobileSettingsDialog(props: MobileSettingsDialogProps) {
  const { className, ...restProps } = props

  const { isOpen } = useStoreSelector(state => globalDialogsSelectors.getDialogState(state, 'settings'))

  const { setDialogOpenStatus } = useActionCreators(globalDialogsActions)

  const handleOnOpenChange = (open: boolean) => {
    setDialogOpenStatus({ dialog: 'settings', status: open })
  }

  const closeDialog = () => setDialogOpenStatus({ dialog: 'settings', status: false })

  return (
    <Sheet open={isOpen} onOpenChange={handleOnOpenChange}>
      <SheetContent className={className} side="bottom" isFullPageSize {...restProps}>
        <Flex className="h-full" direction="column">
          <SheetHeader className="flex flex-row w-full justify-between h-fit items-center">
            <SheetTitle className="mb-0">
              Настройки
            </SheetTitle>
            <Button
              className="text-gray hover:text-gray-accent"
              variant="ghost"
              size="sm"
              isIconOnly
              icon={<Icons.LargeCross size="sm" />}
              onClick={closeDialog}
            />
          </SheetHeader>

          <SettingsTabs />
        </Flex>

      </SheetContent>
    </Sheet>
  )
}

function SettingsTabs() {
  return (
    <Tabs
      className="relative flex w-full h-full flex-col"
      variant="bottomLine"
      orientation="horizontal"
      defaultValue="auction"
    >
      <Flex className="w-full py-2 tablet:px-4" direction="column">
        <TabsList className="w-fit px-1 gap-y-6 tablet:gap-x-5">
          <TabsTrigger className="w-full justify-start gap-x-1.5 py-1 px-2" value="auction">
            Аукцион
          </TabsTrigger>
          <TabsTrigger className="w-full justify-start gap-x-1.5 py-1 px-2" value="integrations">
            Интеграции
          </TabsTrigger>
        </TabsList>
        <Divider />
      </Flex>

      <AuctionSettingsTabContent />
      <IntegrationsSettingsTabContent />

    </Tabs>
  )
}

type BaseSettingsPanelProps = ComponentPropsWithoutRef<'div'> & {
  title: string
  description: string
}

function BaseSettingsPanel(props: BaseSettingsPanelProps) {
  const { title, description, className, children, ...restProps } = props

  return (
    <div className={cn('w-full h-fit py-4', className)} {...restProps}>
      <div className="flex flex-col gap-y-4 w-full h-full pr-0.5 gap-x-6 tablet:flex-row tablet:justify-between tablet:items-center">
        <div className="flex flex-col">
          <Text className="font-semibold text-base">
            {title}
          </Text>
          <Text className="font-normal text-gray-light max-mobile:text-sm">
            {description}
          </Text>
        </div>
        {children}
      </div>
    </div>
  )
}

function AuctionSettingsTabContent() {
  const { editor } = useCurrentEditor()

  return (
    <TabsContent className="w-full h-full px-1.5 tablet:px-6 tablet:py-3 mt-0" value="auction">
      <ScrollArea className="w-full h-full">

        <BaseSettingsPanel
          title="Название аукциона"
          description="Измените название аукциона на странице зрителей"
        >
          <Input
            slotClassNames={{ input: 'max-w-[400px]' }}
            placeholder="Название аукциона"
          />
        </BaseSettingsPanel>

        <Divider className="my-2 tablet:my-4" />

        <BaseSettingsPanel
          title="Текстовые правила аукциона"
          description="Измените текст правил аукциона, отображающиеся на странице зрителей"
        >
          <AuctionTextRulesWysiwygEditorDialog editor={editor!} />
        </BaseSettingsPanel>

        <Divider className="my-2 tablet:my-4" />

        <BaseSettingsPanel
          title="Удалить аукцион"
          description="Удалите аукцион (восстановлению не подлежит)"
        >
          <DeleteAuctionDialog />
        </BaseSettingsPanel>
      </ScrollArea>

    </TabsContent>
  )
}

function IntegrationsSettingsTabContent() {
  return (
    <TabsContent className="w-full h-full m-0" value="integrations">
      <Flex className="h-full w-full gap-y-3 px-2 pt-2 tablet:px-6 tablet:py-6" direction="column">
        <Title order={3}>Платформы для пожертвований</Title>
        <div className="w-full flex gap-2 flex-col">
          <DonationAlertsIntegrationCard />
          <DonatePayIntegrationCard />
        </div>
      </Flex>
    </TabsContent>
  )
}
