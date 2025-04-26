import { TabsContent, TabsContentProps } from '@radix-ui/react-tabs'
import { IntegrationBadge } from '~entities/integrations/ui/badge'

import { ProcessedDonation } from '~entities/donation/model'
import { DonationCardBadge } from '~entities/donation/ui/card'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { formatNumberToIntlString } from '~shared/utils'

import { ProcessDonationCard } from '../dialog-card'

type DonationStatusTabContentProps = Omit<TabsContentProps, 'value'> & {
  donation: ProcessedDonation
}

const DonationStatusTabContent = (props: DonationStatusTabContentProps) => {
  const { donation, ...restProps } = props
  return (
    <TabsContent className="w-full h-full mt-4" value="status" {...restProps}>
      <Flex className="w-full gap-y-2" direction="column">
        <ProcessDonationCard
          title="Статус"
          titleIcon={<Icons.Status className="text-gray" size="sm" />}
        >
          <DonationCardBadge status={donation.processingStatus} />
        </ProcessDonationCard>
        <ProcessDonationCard
          title="Обоснование статуса"
          titleIcon={<Icons.Info className="text-gray" size="sm" />}
          contentPosition="bottom"
        >
          <Typography tag="p">
            Наиболее распространные причины: наличие оскорбления(-ий) в тексте
            сообщения и/или имени пожертвователя неправономерная информация в
            тексте сообщения и/или имени пожертвователя недопустимые названия
            нового слота{' '}
          </Typography>
        </ProcessDonationCard>
        <ProcessDonationCard
          title="Тип пожертвования"
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

export { DonationStatusTabContent }
