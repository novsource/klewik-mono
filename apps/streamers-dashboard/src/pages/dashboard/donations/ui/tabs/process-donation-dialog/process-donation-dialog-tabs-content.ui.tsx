import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { useProcessDonationContext } from '~features/donations/process-donation/context'
import { ProcessDonationFormComposer } from '~features/donations/process-donation/ui'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { DONATION_PROCESSED_STATUS } from '~entities/donation/constants'
import type {
  DonationCode,
  ProcessedDonation,
  ProcessedDonationStatus,
} from '~entities/donation/model'
import { getDonationCodeFromMessage } from '~entities/donation/utils'

import { IntegrationBadge } from '~entities/integrations/ui/badge'

import { Text } from '~shared/components/typography'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from 'klewik-ui/button'
import { Caption } from 'klewik-ui/caption'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import { Skeleton } from 'klewik-ui/skeleton'
import type { TabsContentProps } from 'klewik-ui/tabs'
import { TabsContent } from 'klewik-ui/tabs'
import { Typography } from 'klewik-ui/typography'

import { cn, formatNumberToIntlString } from '~shared/utils'

import { ProcessDonationCard } from '../../cards/process-donation-dialog-card.ui'

export type ProcessDonationTabContentProps = Omit<TabsContentProps, 'value'> & {
  donation: ProcessedDonation
  donationCodeInfo?: DonationCode
}

export const ProcessDonationTabContent = (
  props: ProcessDonationTabContentProps,
) => {
  const { className, donation, ...restProps } = props

  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const { state: { isConflict, isDonationCodeLoading } } = useProcessDonationContext()

  return (
    <TabsContent
      className={cn('w-full h-full mt-4', className)}
      value="processDonation"
      {...restProps}
    >
      {isConflict && (
        <Caption variant="warn" className="w-full mb-4" title="Конфликт">
          <Text className="max-tablet:text-sm">
            Донат-код ссылается на слот, который был переименован или удален
          </Text>
          <Text className="max-tablet:text-sm">
            Если слота с названием из поля "Желаемый слот" (смотрите ниже) нет в аукционе, то он будет создан.
            При желании вы можете измените содержание поля "Слот" на актуальное название слота или любое другое название
          </Text>
        </Caption>
      )}
      <Flex className="w-full gap-y-1.5 tablet:gap-y-2" direction="column">
        <DonationProcessStatusCard status={donation.processData.status} />
        <ProcessedDonationCodeCard donation={donation} slots={auctionSlots} />
        <ProcessDonationCard
          className="pt-3 pb-1"
          contentPosition="bottom"
          title="Итоговое название слота"
          titleIcon={<Icons.Slots className="text-gray" size="xs" />}
        >
          {isDonationCodeLoading
            ? <Skeleton className="w-full h-9" />
            : (
              <ProcessDonationFormComposer.SlotTitleInput auctionSlots={auctionSlots} />
            )}
        </ProcessDonationCard>
        <ProcessDonationCard
          className="py-2"
          contentPosition="right"
          title="Очки"
          titleIcon={<Icons.Coin className="text-gray" size="sm" />}
        >
          {isDonationCodeLoading
            ? <Skeleton className="w-20 h-9" />
            : (
              <ProcessDonationFormComposer.SlotPointsInput />
            )}
        </ProcessDonationCard>
      </Flex>
    </TabsContent>
  )
}

type DonationProcessStatusCardProps = {
  status: ProcessedDonationStatus
}

function DonationProcessStatusCard(props: DonationProcessStatusCardProps) {
  const { status } = props

  const statusIcons: Record<ProcessedDonationStatus, ReactNode> = {
    added: <Icons.Success size="xs" />,
    checkRequested: <Icons.Hourglass size="xs" />,
    empty: <Icons.LargeCross size="xs" />,
    error: <Icons.Close size="xs" />,
    inProgress: <Icons.Timer size="xs" />,
    rejected: <Icons.Decline size="xs" />,
  }

  const statusStyles: Record<ProcessedDonationStatus, string> = {
    added: 'bg-green-dark text-green-accent',
    checkRequested: 'bg-yellow/10 text-yellow',
    empty: 'bg-dark-accent text-gray-accent',
    error: 'bg-red/10 text-red',
    inProgress: 'bg-yellow/10 text-yellow',
    rejected: 'bg-red/10 text-red',
  }

  return (
    <ProcessDonationCard
      contentPosition="right"
      title="Статус"
      titleIcon={<Icons.Tag className="text-gray" size="xs" />}
    >
      <div
        className={cn(
          'inline-flex gap-x-1 px-2 py-1 rounded-small text-sm',
          statusStyles[status],
        )}
      >
        {statusIcons[status]}
        {DONATION_PROCESSED_STATUS[status]}
      </div>
    </ProcessDonationCard>
  )
}

type ProcessedDonationCodeCardProps = {
  donation: ProcessedDonation
  slots: AuctionSlot[]
}

function ProcessedDonationCodeCard(props: ProcessedDonationCodeCardProps) {
  const { donation, slots } = props

  const {
    state: {
      donationCode,
      isDonationCodeLoading,
      isDonationCodeLoadingError,
    },
    functions: {
      reloadDonationCode,
    },
    dispatch: { setIsConflict },
  } = useProcessDonationContext()

  const code = getDonationCodeFromMessage(donation.message || '')

  useEffect(() => {
    if (slots.length === 0 || !donationCode || !donationCode.slotId)
      return

    const slotFromStore = slots.find(
      slot => slot.id === donationCode.slotId,
    )

    if (!slotFromStore) {
      return setIsConflict(true)
    }

    const isTitlesEquals = slotFromStore.title === donationCode.title

    if (!isTitlesEquals) {
      setIsConflict(true)
    }
    else {
      setIsConflict(false)
    }
  }, [donationCode, slots])

  if (!code) {
    return (
      <ProcessDonationCard
        title="Донат-код"
        titleIcon={
          <Icons.DonationCode className="text-gray" width={14} height={14} />
        }
      >
        Не найден
      </ProcessDonationCard>
    )
  }

  if (isDonationCodeLoading) {
    return (
      <>
        <ProcessDonationCard
          title="Донат-код"
          titleIcon={
            <Icons.DonationCode className="text-gray" width={14} height={14} />
          }
        >
          {`#${code}`}
        </ProcessDonationCard>
        <ProcessDonationCard
          contentPosition="bottom"
          title="Желаемый слот"
          titleIcon={
            <Icons.Slots className="text-gray" width={14} height={14} />
          }
        >
          <Skeleton className="w-20 h-7" />
        </ProcessDonationCard>
        <ProcessDonationCard
          contentPosition="bottom"
          title="Ссылался на этот слот во время создание кода"
          titleIcon={
            <Icons.LinkArrow className="text-gray" size="xs" />
          }
        >
          <Skeleton className="w-40 h-7" />
        </ProcessDonationCard>
      </>

    )
  }

  if (isDonationCodeLoadingError) {
    return (
      <>
        <ProcessDonationCard
          title="Донат-код"
          titleIcon={
            <Icons.DonationCode className="text-gray" width={14} height={14} />
          }
        >
          {`#${code}`}
        </ProcessDonationCard>
        <ProcessDonationCard
          contentPosition="bottom"
          title="Желаемый слот"
          titleIcon={
            <Icons.Slots className="text-gray" width={14} height={14} />
          }
        >
          <Flex>
            <Typography tag="span">Не удалось загрузить данные</Typography>
            <Button
              onClick={() => reloadDonationCode(donation.message)}
            >
              Загрузить еще раз
            </Button>
          </Flex>
        </ProcessDonationCard>
        <ProcessDonationCard
          contentPosition="bottom"
          title="Ссылался на слот во время создание кода"
          titleIcon={
            <Icons.LinkArrow className="text-gray" size="xs" />
          }
        >
          <Flex>
            <Text asSpan>Не удалось загрузить данные</Text>
            <Button
              onClick={() => reloadDonationCode(donation.message)}
            >
              Загрузить еще раз
            </Button>
          </Flex>
        </ProcessDonationCard>
      </>
    )
  }

  const targetSlot = slots?.find(item => item.id === donationCode?.slotId)

  return (
    <>
      <ProcessDonationCard
        title="Донат-код"
        titleIcon={
          <Icons.DonationCode className="text-gray" width={14} height={14} />
        }
      >
        {`#${code}`}
      </ProcessDonationCard>
      <ProcessDonationCard
        contentPosition="bottom"
        title="Желаемый слот"
        titleIcon={
          <Icons.Slots className="text-gray" width={14} height={14} />
        }
      >
        {donationCode?.title}
      </ProcessDonationCard>
      <ProcessDonationCard
        contentPosition="bottom"
        title="Ссылался на слот во время создание кода"
        titleIcon={
          <Icons.LinkArrow className="text-gray" size="xs" />
        }
      >
        {targetSlot ? targetSlot.title : 'Не ссылался ни на один слот'}
      </ProcessDonationCard>
    </>
  )
}

type ProcessDonationInfoTabContentProps = Omit<TabsContentProps, 'value'> & {
  donation: ProcessedDonation
}

export function ProcessDonationInfoTabContent(props: ProcessDonationInfoTabContentProps) {
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
