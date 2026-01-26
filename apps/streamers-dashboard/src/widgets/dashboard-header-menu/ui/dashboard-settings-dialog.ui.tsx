import { useState } from 'react'

import { DonatePayIntegrationCard } from '~features/integrations/connect-integration/ui/donate-pay'
import { DonationAlertsIntegrationCard } from '~features/integrations/connect-integration/ui/donation-alerts'

import { Title } from '~shared/components/typography'

import { Button } from '~shared/ui/button'
import type { CommandItemProps } from '~shared/ui/command'
import { CommandItem } from '~shared/ui/command'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~shared/ui/dialog'
import { Divider } from '~shared/ui/divider'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~shared/ui/tabs'

import { cn } from '~shared/utils'

type AuctionSettingsDialogProps = CommandItemProps

export const AuctionSettingsDialog = (props: AuctionSettingsDialogProps) => {
  const { className, ...restProps } = props

  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full">
        <CommandItem
          className={cn(['cursor-pointer'], className)}
          {...restProps}
        >
          <Icons.Settings size="xs" />
          Настройки
        </CommandItem>
      </DialogTrigger>
      <DialogContent
        className="flex flex-col w-4/5 landtop:w-3/5 landtop:h-4/5 desktop:w-1/2 desktop-lg:w-1/2 h-3/5 border-dark-light rounded-[16px] bg-dark-foreground overflow-clip p-0 gap-y-0"
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
              onClick={() => setIsOpen(false)}
            />
          </DialogHeader>
          <Divider />
        </Flex>
        <Flex className="h-full">
          <SettingsTabs />
        </Flex>
        <Divider />
        <DialogFooter className="w-full h-fit justify-end flex-row gap-x-2 px-4 py-2">
          <Button size="sm" onClick={() => setIsOpen(false)}>
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

function SettingsTabs() {
  return (
    <Tabs className="flex w-full h-full flex-row" variant="underline" orientation="vertical" defaultValue="auction">
      <Flex className="w-44 h-full py-4 pl-2 border-r-1 border-dark-accent">
        <TabsList className="w-full gap-y-6 tablet:gap-y-2">
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
      <TabsContent className="w-full h-full px-6 py-3 mt-10" value="auction">
        Auction content
      </TabsContent>
      <TabsContent className="w-full h-full m-0" value="integrations">
        <Flex className="h-full w-full gap-y-3 px-6 py-6" direction="column">
          <Title order={3}>Платформы для пожертвований</Title>
          <div className="w-full grid landtop:grid-cols-2 desktop:grid-cols-3 gap-2">
            <DonationAlertsIntegrationCard />
            <DonatePayIntegrationCard />
          </div>
        </Flex>
      </TabsContent>
      <TabsContent className="w-full h-full px-6 py-3" value="timer">
        timer content
      </TabsContent>

    </Tabs>
  )
}
