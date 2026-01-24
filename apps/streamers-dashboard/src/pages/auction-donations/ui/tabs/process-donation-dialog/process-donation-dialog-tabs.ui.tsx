import type { ProcessedDonation } from '~entities/donation/model'

import type { TabsProps } from '~shared/ui/tabs'
import { Tabs, TabsList, TabsTrigger } from '~shared/ui/tabs'

import { cn } from '~shared/utils'

import { ProcessDonationInfoTabContent, ProcessDonationTabContent } from './process-donation-dialog-tabs-content.ui'

export type ProcessDonationDialogTabsProps = TabsProps & {
  donation: ProcessedDonation
}

export const ProcessDonationDialogTabs = (props: ProcessDonationDialogTabsProps) => {
  const { donation, className, ...restProps } = props

  return (
    <Tabs className={cn('flex flex-col w-full h-full', className)} defaultValue="info" {...restProps}>
      <TabsList className="flex w-fit justify-between rounded-large bg-dark">
        <TabsTrigger
          className="flex gap-x-1 text-md font-medium data-[state=active]:rounded-[8px] cursor-pointer text-gray-light/70 hover:text-gray-light data-[state=active]:[&_button]:block"
          value="info"
        >
          Общее
        </TabsTrigger>
        <TabsTrigger
          className="flex gap-x-1 text-md font-medium data-[state=active]:rounded-[8px] cursor-pointer text-gray-light/70 hover:text-gray-light data-[state=active]:[&_button]:block"
          value="processDonation"
        >
          Статус обработки
        </TabsTrigger>
      </TabsList>

      <ProcessDonationInfoTabContent donation={donation} />
      <ProcessDonationTabContent donation={donation} />
    </Tabs>
  )
}
