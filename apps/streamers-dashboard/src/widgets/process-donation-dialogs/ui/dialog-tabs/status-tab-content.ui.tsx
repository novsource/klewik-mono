import { TabsContent, TabsContentProps } from '@radix-ui/react-tabs'

import { ProcessedDonation } from '~entities/donation/model'
import { DonationCardBadge } from '~entities/donation/ui/card'

import { Badge } from '~shared/ui/badge'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

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
          <DonationCardBadge status={donation.processedStatus} />
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
          title="Дата изменения статуса"
          titleIcon={<Icons.Timer className="text-gray" size="sm" />}
        >
          {donation.createdAt}
        </ProcessDonationCard>
        <ProcessDonationCard
          title="Тип пожертвования"
          titleIcon={<Icons.Signpost className="text-gray" size="sm" />}
        >
          <Badge className="h-full w-full font-medium">
            Прибавление очков к слоту
          </Badge>
        </ProcessDonationCard>

        <ProcessDonationCard
          contentPosition="bottom"
          title="Сообщение"
          titleIcon={
            donation.messageType === 'audio' ? (
              <Icons.Sound className="text-gray" size="sm" />
            ) : (
              <Icons.Message className="text-gray" size="sm" />
            )
          }
        >
          <Typography
            className={cn(
              donation.messageType === 'audio' && 'text-gray-accent'
            )}
            tag="span"
          >
            {donation.messageType === 'audio'
              ? 'Аудио-формат сообщений не поддерживается'
              : donation.message}
          </Typography>
        </ProcessDonationCard>
      </Flex>
    </TabsContent>
  )
}

export { DonationStatusTabContent }
