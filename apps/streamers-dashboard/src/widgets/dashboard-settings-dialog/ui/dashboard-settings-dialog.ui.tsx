import type { ComponentPropsWithoutRef } from 'react'

import { globalDialogsActions, globalDialogsSelectors } from '~features/_common/display-dialogs'

import { DonatePayIntegrationCard } from '~features/integrations/connect-integration/ui/donate-pay'
import { DonationAlertsIntegrationCard } from '~features/integrations/connect-integration/ui/donation-alerts'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~shared/ui/dialog'
import { Divider } from '~shared/ui/divider'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { ScrollArea } from '~shared/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~shared/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~shared/ui/tabs'
import { Typography } from '~shared/ui/typograghy'

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
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogContent
        className="flex flex-col w-4/5 landtop:w-3/5 landtop:h-4/5 desktop:w-1/2 desktop-lg:w-1/2 h-3/5 border-dark-light rounded-[16px] bg-dark-foreground overflow-clip p-0 gap-y-0"
        {...restProps}
      >
        <Flex className="w-full h-fit" direction="column">
          <DialogHeader className="flex flex-row w-full justify-between p-0.5 pl-6 h-fit items-center">
            <DialogTitle className="font-semibold text-md text-gray-light leading-4">
              Настройки
            </DialogTitle>
            <Button
              className="text-gray hover:text-gray-accent"
              variant="ghost"
              size="sm"
              isIconOnly
              icon={<Icons.LargeCross size="sm" />}
              onClick={closeDialog}
            />
          </DialogHeader>
          <Divider />
        </Flex>
        <Flex className="h-full">
          <SettingsTabs />
        </Flex>
        <Divider />
        <DialogFooter className="w-full h-fit justify-end flex-row gap-x-2 px-4 py-2">
          <Button size="sm" onClick={closeDialog}>
            Отмена
          </Button>
          <Button variant="action" size="sm" disabled>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
          <Flex className="h-full">
            <SettingsTabs />
          </Flex>
        </Flex>

      </SheetContent>
    </Sheet>
  )
}

function SettingsTabs() {
  return (
    <Tabs
      className="flex w-full h-full flex-col"
      variant="bottomLine"
      orientation="horizontal"
      defaultValue="auction"
    >
      <Flex className="w-full py-4 tablet:px-4">
        <TabsList className="w-fit gap-y-6 max-tablet:text-md tablet:gap-x-3.5">
          <TabsTrigger className="w-full justify-start gap-x-1.5 py-1 px-1" value="auction">
            Аукцион
          </TabsTrigger>
          <TabsTrigger className="w-full justify-start gap-x-1.5 py-1 px-1" value="timer">
            Таймер
          </TabsTrigger>
          <TabsTrigger className="w-full justify-start gap-x-1.5 py-1 px-1" value="integrations">
            Интеграции
          </TabsTrigger>
        </TabsList>
      </Flex>
      <ScrollArea className="w-full h-full px-3 pt-3">
        <TabsContent className="w-full h-full px-6 py-3" value="auction">
          Auction content
        </TabsContent>
        <TabsContent className="w-full h-full m-0" value="integrations">
          <Flex className="h-full w-full gap-y-3 tablet:px-6 tablet:py-6" direction="column">
            <Typography tag="h3">Платформы для пожертвований</Typography>
            <div className="w-full flex gap-2 flex-col mobile:flex-row">
              <DonationAlertsIntegrationCard />
              <DonatePayIntegrationCard />
            </div>
          </Flex>
        </TabsContent>
        <TabsContent className="w-full h-full px-6 py-3" value="timer">
          timer content
        </TabsContent>
      </ScrollArea>
    </Tabs>
  )
}
