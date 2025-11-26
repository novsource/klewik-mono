import type { TabsContentProps } from '@radix-ui/react-tabs'

import { useMemo, useState } from 'react'

import { TABS_CONTENT_NAMES } from '~pages/auction-wheel/constants'
import type { ControlWheelTabSlots } from '~pages/auction-wheel/styles'
import { controlWheelTabStyles } from '~pages/auction-wheel/styles'

import { SpinTimeInput } from '~features/wheel/set-spin-time/ui'
import { SpinWheelButton } from '~features/wheel/spin-wheel/ui'

import { auctionActions, auctionSelectors } from '~entities/auction/store'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Divider } from '~shared/ui/divider'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { RadioCard, RadioCardDescription, RadioCardTitle, RadioGroup } from '~shared/ui/radio'
import { TabsContent } from '~shared/ui/tabs'
import { Typography } from '~shared/ui/typograghy'

import { twSlotsStyles } from '~shared/utils'

type ControlWheelTabContentProps = Omit<TabsContentProps, 'value'> & {
  slotsClassnames?: Partial<Record<ControlWheelTabSlots, string>>
}

export const ControlWheelTabContent = (props: ControlWheelTabContentProps) => {
  const { slotsClassnames, ...tabsContentProps } = props

  const tabsContentStyles = useMemo(() => twSlotsStyles(controlWheelTabStyles, slotsClassnames), [slotsClassnames])

  return (
    <TabsContent
      className={tabsContentStyles.content}
      value={TABS_CONTENT_NAMES.CONTROL}
      {...tabsContentProps}
    >
      <WheelControl />
      <Divider className="mt-2.5 mb-3 border-gray/20" />
      <GamesChooseRadioGroup />
      <Divider className="mt-2.5 mb-3 border-gray/20" />
      <GameModeChooseRadioGroup />
    </TabsContent>
  )
}

function WheelControl() {
  const tabsContentStyles = useMemo(() => twSlotsStyles(controlWheelTabStyles), [])

  return (
    <Flex className={tabsContentStyles.controlsWrapper}>
      <SpinWheelButton className={tabsContentStyles.spinWheelButton} />
      <SpinTimeInput />
    </Flex>
  )
}

function GameModeChooseRadioGroup() {
  const { wheelMode } = useStoreSelector(auctionSelectors.getAuctionInfo)

  const { updateWheelMode } = useActionCreators(auctionActions)

  return (
    <Flex direction="column">
      <Typography
        className="text-white/80 font-medium font-golos-f mb-2.5"
        tag="h3"
      >
        Режим игры
      </Typography>
      <RadioGroup
        className="w-full flex flex-col gap-y-2 desktop:gap-x-3 desktop:justify-between desktop:flex-row"
        value={wheelMode}
      >
        <RadioCard
          slotsClassnames={{ label: 'w-full grow p-0' }}
          value="classic"
          icon={<Icons.Crown className="text-gray-accent" />}
          onClick={() => updateWheelMode('classic')}
        >
          <RadioCardTitle>Классика</RadioCardTitle>
          <RadioCardDescription>Победитель определяется сразу</RadioCardDescription>
        </RadioCard>
        <RadioCard
          slotsClassnames={{ label: 'w-full grow p-0' }}
          value="dropout"
          icon={<Icons.Ranking className="text-gray-accent" size="lg" />}
          onClick={() => updateWheelMode('dropout')}
        >
          <RadioCardTitle>На выбывание</RadioCardTitle>
          <RadioCardDescription>Побеждает оставшийся слот</RadioCardDescription>
        </RadioCard>
      </RadioGroup>
    </Flex>
  )
}

type AuctionGames = 'wheel' | 'cards'

function GamesChooseRadioGroup() {
  const [choosenGame, setChoosenGame] = useState<AuctionGames>('wheel')

  return (
    <Flex direction="column">
      <Typography
        className="text-white/80 font-medium font-golos-f mb-2.5"
        tag="h3"
      >
        Формат
      </Typography>
      <RadioGroup
        className="w-full flex flex-col gap-y-2 desktop:gap-x-3 desktop:justify-between desktop:flex-row"
        value={choosenGame}
      >
        <RadioCard
          slotsClassnames={{ label: 'w-full grow p-0' }}
          value="wheel"
          icon={<Icons.Wheel className="text-gray-accent" />}
          onClick={() => setChoosenGame('wheel')}
        >
          <RadioCardTitle>Колесо</RadioCardTitle>
          <RadioCardDescription>Стандартное колесо фортуны</RadioCardDescription>
        </RadioCard>
        <RadioCard
          slotsClassnames={{ label: 'w-full grow p-0' }}
          value="cards"
          onClick={() => setChoosenGame('cards')}
        >
          <RadioCardTitle>Карты</RadioCardTitle>
          <RadioCardDescription>Слоты спрятаны под картами</RadioCardDescription>
        </RadioCard>
      </RadioGroup>
    </Flex>
  )
}
