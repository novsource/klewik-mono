import type { ReactNode } from 'react'

import { Tabs, TabsList, TabsTrigger } from '~shared/ui/tabs'
import { cn } from '~shared/utils'

import { BaseAuctionSettingsContent } from './base-auction-settings'
import { AuctionIntegrationsSettings } from './integrations-settings'
import { MainEventSettingsContent } from './main-event-settings'
import { AuctionTimerSettingsContent } from './timer-settings'

type SettingsAreas = 'integrations' | 'timer' | 'base'

type SettingsTabsTriggers = Record<
  SettingsAreas,
  {
    title: string
    icon?: ReactNode
  }
>

const settingsAreas: SettingsTabsTriggers = {
  base: {
    title: 'Аукцион',
  },
  integrations: {
    title: 'Интеграции',
  },
  timer: {
    title: 'Таймер',
  },
} as const

const AuctionSettingsPage = () => {
  return (
    <div
      className={cn([
        'mx-auto w-full h-full pt-5 mb-4 grid grid-rows-slots-table gap-y-3',
        'mobile:gap-y-5',
        'tablet:grid-rows-slots-desktop max-tablet:max-w-[1100px] tablet:gap-y-4 tablet:pl-10',
        'desktop:max-w-[1750px] desktop-lg:max-w-[2100px]',
        'landtop:max-w-[1600px]',
      ])}
    >
      <Tabs
        className="dark w-full h-full flex flex-col gap-y-8"
        defaultValue="base"
      >
        <TabsList className="dark flex justify-between rounded-large bg-dark w-fit">
          {(
            Object.keys(settingsAreas) as Array<keyof typeof settingsAreas>
          ).map(area => (
            <TabsTrigger
              className="px-3 tablet:px-4.5 flex grow gap-x-1.5 text-md font-medium data-[state=active]:rounded-[8px] cursor-pointer text-gray-light/70 hover:text-gray-light leading-5"
              value={area}
              key={area}
            >
              {settingsAreas[area].icon}
              {settingsAreas[area].title}
            </TabsTrigger>
          ))}
        </TabsList>
        <BaseAuctionSettingsContent />
        <AuctionIntegrationsSettings />

        <AuctionTimerSettingsContent />
        <MainEventSettingsContent />
      </Tabs>
    </div>
  )
}

export { AuctionSettingsPage }
