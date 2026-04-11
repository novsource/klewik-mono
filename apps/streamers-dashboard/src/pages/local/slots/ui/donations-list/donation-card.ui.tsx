import { useMemo, useState } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import type { Donation, DonationMessageType } from '~entities/donation/model'

import type { IntegrationsPlatforms } from '~entities/integrations/model'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import type { AutocompleteTag } from 'klewik-ui/autocomplete'
import { Autocomplete, AutocompleteContent, AutocompleteInput, AutocompleteItem } from 'klewik-ui/autocomplete'
import { Button } from 'klewik-ui/button'
import { Card } from 'klewik-ui/card'
import { Divider } from 'klewik-ui/divider'
import { Group } from 'klewik-ui/group'
import { Icons } from 'klewik-ui/icons'
import { Stack } from 'klewik-ui/stack'
import { Switch } from 'klewik-ui/switch'
import { Text } from 'klewik-ui/typography'

import { formatNumberToIntlString } from '~shared/utils'
import { getRandomNumberInRange, hexToRgba } from '~shared/utils/common'
import { cn } from '~shared/utils/react'

import { useLocalDonationCard } from '../../hooks/use-local-donation-card'
import { useTextSlotsReferences } from '../../hooks/use-text-slots-references'
import { SlotPointsInput } from '../auctions-slots-list/slot-points-input.ui'

export type DonationsListCardProps = {
  donation: Donation
  className?: string
}

export const DonationsListCard = (props: DonationsListCardProps) => {
  const { donation, className } = props

  const [slotInputValue, setSlotInputValue] = useState<string>('')
  const [slotPointsValue, setPointsValue] = useState<number | undefined>(donation.amount)

  const { approveDonation, declineDonation } = useLocalDonationCard()

  return (
    <Card className={cn('w-full flex relative items-center flex-col', className)}>
      <Group className="w-full h-5.75 mb-4" justify="space-between">

        <Group className="w-full h-full" gap="sm" justify="flex-start">
          <DonationPlatformBadge platform={donation.source} />
          <DonationMoneyBadge amount={donation.amount} currency={donation.currency} />
        </Group>

        <Group gap="sm">
          <Button
            variant="action"
            isIconOnly
            icon={<Icons.Like />}
            size="xs"
            onClick={() => approveDonation({ title: slotInputValue, points: slotPointsValue })}
          />
          <Button
            variant="error"
            isIconOnly
            icon={<Icons.Decline />}
            size="xs"
            onClick={declineDonation}
          />
        </Group>

      </Group>

      <Stack className="w-full" gap="xs">
        <SlotTitleAutocomplete value={slotInputValue} onValueChange={setSlotInputValue} />
        <SlotPointsInput placeholder="Очки" value={slotPointsValue} onInput={value => setPointsValue(value)} />
      </Stack>

      <Divider className="mt-2 mb-4 w-1/5 text-center" orientation="horizontal" />

      <DonationMessage
        message={donation.message}
        messageType={donation.messageType}
        onSlotChoose={slot => setSlotInputValue(slot.title)}
      />

      <Group className="w-full" justify="flex-start" gap="xs">
        <Icons.User className="text-gray" size="sm" />
        <Text className="text-gray-accent" asSpan>{donation.username}</Text>
      </Group>
    </Card>
  )
}

type DonationMoneyBadgeProps = {
  amount: number
  currency: string
}

function DonationMoneyBadge(props: DonationMoneyBadgeProps) {
  const { amount, currency } = props

  return (
    <Group
      className="w-fit h-full rounded-medium bg-green-light/40 text-green px-2 text-sm font-medium"
      gap="xs"
    >
      <Icons.Money size="sm" />
      <Text className="text-sm font-semibold" asSpan>{`${formatNumberToIntlString(amount)} ${currency}`}</Text>
    </Group>
  )
}

type DonationPlatformBadgeProps = {
  platform: IntegrationsPlatforms
}

function DonationPlatformBadge(props: DonationPlatformBadgeProps) {
  const { platform } = props

  return (
    <div className={cn(
      'w-fit h-full rounded-medium px-2 py-1 font-medium',
      platform === 'donationAlerts' && 'bg-orange/10',
    )}
    >
      {platform === 'donationAlerts'
        && <Icons.DonationAlerts className=" [&_path]:fill-orange" size="xs" />}
    </div>
  )
}

type SlotTitleAutocompleteProps = {
  value?: string
  onValueChange?: (value: string) => void
}

function SlotTitleAutocomplete(props: SlotTitleAutocompleteProps) {
  const { value, onValueChange } = props

  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const handleRandomButtonOnClick = () => {
    const randomIndex = Math.round(getRandomNumberInRange(0, auctionSlots.length - 1))
    const randomSlot = auctionSlots[randomIndex]

    onValueChange?.(randomSlot.title)
  }

  const autocompleteTags = useMemo(() => {
    return auctionSlots.map<AutocompleteTag>(slot => ({ id: slot.title, value: slot.title }))
  }, [auctionSlots])

  return (
    <Autocomplete items={autocompleteTags} mode="both" value={value} onValueChange={onValueChange}>
      <AutocompleteInput
        slotClassNames={{ base: 'w-full pointer-events-auto', input: 'pl-3 pr-2 text-title' }}
        variant="ghost"
        size="lg"
        placeholder="Название слота"
        endContent={(
          <Button
            className="pointer-events-auto hover:text-white/70 text-gray-light"
            variant="ghost"
            isIconOnly
            icon={<Icons.Actions />}
            size="sm"
            onClick={handleRandomButtonOnClick}
          />
        )}
      />

      <AutocompleteContent positionerProps={{ sideOffset: 8 }}>
        {tag => <AutocompleteItem tag={tag}></AutocompleteItem>}
      </AutocompleteContent>
    </Autocomplete>
  )
}

type DonationMessageProps = {
  message: string | null
  messageType: DonationMessageType
  onSlotChoose?: (slot: AuctionSlot) => void
}

function DonationMessage(props: DonationMessageProps) {
  const { message, messageType, onSlotChoose } = props

  const [isSlotsHighlightingEnabled, setIsSlotsHighlightingEnabled] = useState(false)

  const slotsReferencesInMessage = useTextSlotsReferences(message ?? '')

  const renderMessage = () => {
    if (!message)
      return null

    if (
      Object.keys(slotsReferencesInMessage).length === 0
      || !isSlotsHighlightingEnabled
    ) {
      return <Text className="text-white/70" asSpan>{message}</Text>
    }

    let tempSpanValue = ''
    const result = []

    for (let index = 0; index < message.length; index++) {
      const isSlotsReferencesIncludeIndex = Reflect.has(slotsReferencesInMessage, index)

      if (isSlotsReferencesIncludeIndex) {
        const { slot, color } = slotsReferencesInMessage[index]

        result.push(<Text className="text-white/70" asSpan>{tempSpanValue}</Text>)
        result.push(
          <Text
            className="inline-block px-1 rounded-sm cursor-pointer hover:opacity-80"
            asSpan
            style={{ background: hexToRgba(color, 0.1), color }}
            onClick={() => {
              onSlotChoose?.(slot)
            }}
          >
            {slot.title}
          </Text>,
        )

        tempSpanValue = ''
        index += slot.title.length - 1
      }
      else {
        tempSpanValue += message[index]
      }
    }

    if (tempSpanValue.length !== 0) {
      result.push(<Text className="text-white/70" asSpan>{tempSpanValue}</Text>)
    }

    return result
  }

  if (!message) {
    return (
      <div className="w-full bg-dark-light mb-3 px-3 py-2 rounded-medium">
        <Text className="text-sm text-gray" asSpan>Сообщение отсутствует</Text>
      </div>
    )
  }

  if (messageType !== 'text') {
    return (
      <div className="w-full bg-dark-light mb-3 px-3 py-2 rounded-medium">
        <Text className="text-sm text-gray-light" asSpan>Данный вид сообщения не поддерживается</Text>
      </div>
    )
  }

  return (
    <Stack className="w-full mb-3" gap="sm" align="flex-start">
      <Group gap="xs">
        {Object.values(slotsReferencesInMessage).map((reference) => {
          return (
            <Text
              key={reference.slot.title}
              className="cursor-pointer px-1.75 py-0.25 text-md rounded-small hover:opacity-80"
              asSpan
              style={{ background: hexToRgba(reference.color, 0.1), color: reference.color }}
              onClick={() => {
                onSlotChoose?.(reference.slot)
              }}
            >
              {reference.slot.title}
            </Text>
          )
        })}
      </Group>

      <Stack className="w-full bg-dark-light rounded-medium px-3 py-2" gap="sm" align="flex-start">
        <Group className="w-full" justify="space-between">
          <Text className="text-gray-light" asSpan>Сообщение</Text>

          {Object.keys(slotsReferencesInMessage).length !== 0
            && (
              <Group gap="sm">
                <Icons.EyeOpen className="text-gray-accent" size="xs" />
                <Switch
                  checked={isSlotsHighlightingEnabled}
                  size="sm"
                  onCheckedChange={value => setIsSlotsHighlightingEnabled(value)}
                />
              </Group>
            )}

        </Group>

        <div>
          {renderMessage()}
        </div>
      </Stack>
    </Stack>
  )
}
