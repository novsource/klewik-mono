import { TabsContentProps } from '@radix-ui/react-tabs'
import { IntegrationBadge } from '~entities/integrations/ui/badge'

import { ProcessedDonation } from '~entities/donation/model'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { TabsContent } from '~shared/ui/tabs'
import { Typography } from '~shared/ui/typograghy'

import { formatNumberToIntlString } from '~shared/utils'

import { ProcessDonationCard } from '../dialog-card'

type DonationInfoTabContentProps = Omit<TabsContentProps, 'value'> & {
  donation: ProcessedDonation
}

const DonationInfoTabContent = ({
  donation,
  ...restProps
}: DonationInfoTabContentProps) => {
  return (
    <TabsContent className="w-full h-full mt-4" value="info" {...restProps}>
      <Flex className="w-full gap-y-2" direction="column">
        <ProcessDonationCard
          contentPosition="bottom"
          title="Имя пожертвователя"
          titleIcon={<Icons.User className="text-gray" size="sm" />}
        >
          {donation.username}
        </ProcessDonationCard>
        <ProcessDonationCard
          title="Сумма пожертвования"
          titleIcon={<Icons.Money className="text-gray" size="sm" />}
        >
          {donation.amount && (
            <div className="space-x-1">
              <Typography className="text-green-accent" tag="span">
                {formatNumberToIntlString(donation.amount)}
              </Typography>
              <Typography tag="span">{donation?.currency}</Typography>
            </div>
          )}
        </ProcessDonationCard>
        <ProcessDonationCard
          title="Источник"
          titleIcon={<Icons.Source className="text-gray" size="sm" />}
        >
          <IntegrationBadge integration={donation.provider} />
        </ProcessDonationCard>
        <ProcessDonationCard
          title="Дата создания"
          titleIcon={<Icons.Timer className="text-gray" size="sm" />}
        >
          {donation.createdAt}
        </ProcessDonationCard>
        <ProcessDonationCard
          contentPosition="bottom"
          title="Сообщение"
          titleIcon={
            donation.message_type === 'audio' ? (
              <Icons.Sound className="text-gray" size="sm" />
            ) : (
              <Icons.Message className="text-gray" size="sm" />
            )
          }
        >
          {donation.message_type === 'audio'
            ? 'Аудио-формат сообщений не поддерживается'
            : donation.message}
        </ProcessDonationCard>
      </Flex>
    </TabsContent>
  )
}

export { DonationInfoTabContent }
