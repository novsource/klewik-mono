import type { ProcessedDonation } from '~entities/donation/model'

import { IntegrationBadge } from '~entities/integrations/ui/badge'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import type { TabsContentProps, TabsProps } from '~shared/ui/tabs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~shared/ui/tabs'
import { Typography } from '~shared/ui/typograghy'

import { cn, formatNumberToIntlString } from '~shared/utils'

import { ProcessDonationCard } from './dialog-card.ui'
import { ProcessDonationTabContent } from './process-donation-tab-content.ui'

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
      <DonationInfoTabContent donation={donation} />
      <ProcessDonationTabContent donation={donation} />
    </Tabs>
  )
}

type DonationInfoTabContentProps = Omit<TabsContentProps, 'value'> & {
  donation: ProcessedDonation
}

function DonationInfoTabContent(props: DonationInfoTabContentProps) {
  const { donation, className, ...restProps } = props

  return (
    <TabsContent
      className={cn('w-full h-full mt-4', className)}
      value="info"
      {...restProps}
    >
      <Flex className="w-full gap-y-1.5 tablet:gap-y-2" direction="column">
        <ProcessDonationCard
          contentPosition="bottom"
          title="Никнейм"
          titleIcon={<Icons.User className="text-gray" size="sm" />}
        >
          {donation.username}
        </ProcessDonationCard>
        <ProcessDonationCard
          title="Сумма"
          titleIcon={<Icons.Money className="text-gray" size="sm" />}
        >
          {donation.amount && (
            <div className="space-x-1.5">
              <Typography className="font-semibold" tag="span">
                {formatNumberToIntlString(donation.amount)}
              </Typography>
              <Typography className="text-gray font-semibold" tag="span">{donation?.currency}</Typography>
            </div>
          )}
        </ProcessDonationCard>
        <ProcessDonationCard
          title="Источник"
          titleIcon={<Icons.Source className="text-gray" size="sm" />}
        >
          <IntegrationBadge integration={donation.source} />
        </ProcessDonationCard>
        <ProcessDonationCard
          title="Дата создания"
          titleIcon={<Icons.Timer className="text-gray" size="sm" />}
        >
          {new Intl.DateTimeFormat('ru', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(donation.createdAt))}
        </ProcessDonationCard>
        <ProcessDonationCard
          contentPosition="bottom"
          title="Сообщение"
          titleIcon={
            donation.messageType === 'audio'
              ? (
                <Icons.Sound className="text-gray" size="sm" />
              )
              : (
                <Icons.Message className="text-gray" size="sm" />
              )
          }
        >
          {donation.messageType === 'audio'
            ? 'Аудио-формат сообщений не поддерживается'
            : donation.message}
        </ProcessDonationCard>
      </Flex>
    </TabsContent>
  )
}
