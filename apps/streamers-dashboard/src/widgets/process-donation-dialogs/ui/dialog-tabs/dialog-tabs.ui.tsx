import { ProcessedDonation } from '~entities/donation/model'

import { Tabs, TabsList, TabsTrigger } from '~shared/ui/tabs'

import { DonationProcessTabContent } from './control-tab-content.ui'
import { DonationInfoTabContent } from './info-tab-content.ui'
import { DonationStatusTabContent } from './status-tab-content.ui'

type ProcessDonationDialogTabsProps = {
  donation: ProcessedDonation
}

const ProcessDonationDialogTabs = ({
  donation,
}: ProcessDonationDialogTabsProps) => {
  return (
    <Tabs className="flex flex-col w-full h-full" defaultValue="info">
      <TabsList className="flex w-fit justify-between rounded-large bg-dark">
        <TabsTrigger
          className="flex gap-x-1 text-md font-medium data-[state=active]:rounded-[8px] cursor-pointer text-gray-light/70 hover:text-gray-light data-[state=active]:[&_button]:block"
          value="info"
        >
          Общее
        </TabsTrigger>
        <TabsTrigger
          className="flex gap-x-1 text-md font-medium data-[state=active]:rounded-[8px] cursor-pointer text-gray-light/70 hover:text-gray-light data-[state=active]:[&_button]:block"
          value="status"
        >
          Статус обработки
        </TabsTrigger>
        <TabsTrigger
          className="flex gap-x-1 text-md font-medium data-[state=active]:rounded-[8px] cursor-pointer text-gray-light/70 hover:text-gray-light data-[state=active]:[&_button]:block"
          value="process"
        >
          Настроить
        </TabsTrigger>
      </TabsList>
      <DonationInfoTabContent donation={donation} />
      <DonationStatusTabContent donation={donation} />
      <DonationProcessTabContent donation={donation} />
    </Tabs>
  )
}

export { ProcessDonationDialogTabs }
