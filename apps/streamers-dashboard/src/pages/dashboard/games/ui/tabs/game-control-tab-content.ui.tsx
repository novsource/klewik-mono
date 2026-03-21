import type { AuctionGames } from '~entities/games/model'

import type { ControlWheelTabSlots } from '../../styles'

import { useMemo } from 'react'

import { auctionGamesActions, auctionGamesSelectors } from '~entities/games/store'

import { Title } from '~shared/components/typography'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Badge } from 'klewik-ui/badge'
import { Divider } from 'klewik-ui/divider'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import { RadioCard, RadioCardDescription, RadioCardTitle, RadioGroup } from 'klewik-ui/radio'
import type { TabsContentProps } from 'klewik-ui/tabs'
import { TabsContent } from 'klewik-ui/tabs'

import { twSlotsStyles } from '~shared/utils'

import { TABS_CONTENT_NAMES } from '../../constants'
import { useAuctionGameContext } from '../../context/auction-game-context'
import { controlWheelTabStyles } from '../../styles'
import { CardsGameControllers } from './cards/control-tab-content.ui'
import { WheelGameControllers } from './wheel/control-tab-content.ui'

type ControlWheelTabContentProps = Omit<TabsContentProps, 'value'> & {
  slotsClassnames?: Partial<Record<ControlWheelTabSlots, string>>
}

export const GameContorlTabContent = (props: ControlWheelTabContentProps) => {
  const { slotsClassnames, ...tabsContentProps } = props

  const auctionGame = useAuctionGameContext()

  const tabsContentStyles = useMemo(() => twSlotsStyles(controlWheelTabStyles, slotsClassnames), [slotsClassnames])

  return (
    <TabsContent
      className={tabsContentStyles.content}
      value={TABS_CONTENT_NAMES.CONTROL}
      {...tabsContentProps}
    >
      {auctionGame.state.game === 'wheel' && <WheelGameControllers />}
      {auctionGame.state.game === 'cards' && <CardsGameControllers />}
      <Divider className="mt-2.5 mb-3 border-gray/20" />
      <GameTypeRadioGroup />
      <Divider className="mt-2.5 mb-3 border-gray/20" />
      <GameModeRadioGroup />
    </TabsContent>
  )
}

function GameModeRadioGroup() {
  const gameMode = useStoreSelector(auctionGamesSelectors.getGameMode)

  const { setGameMode } = useActionCreators(auctionGamesActions)

  return (
    <Flex direction="column">
      <Title
        className="text-white/80 font-medium font-golos-f mb-2.5"
        order={3}
      >
        Режим игры
      </Title>

      <RadioGroup
        className="w-full flex flex-col gap-y-2 px-0.5 desktop:gap-x-3 desktop:justify-between desktop:flex-row"
        value={gameMode}
        onValueChange={value => setGameMode(value)}
      >
        <RadioCard
          slotsClassnames={{ label: 'w-full grow p-0' }}
          value="classic"
          icon={<Icons.Crown className="text-gray-accent" />}
        >
          <RadioCardTitle>Классика</RadioCardTitle>
          <RadioCardDescription className="text-nowrap">Победитель определяется сразу</RadioCardDescription>
        </RadioCard>
        <RadioCard
          slotsClassnames={{ label: 'w-full grow p-0' }}
          value="dropout"
          icon={<Icons.Ranking className="text-gray-accent" size="lg" />}
        >
          <RadioCardTitle>На выбывание</RadioCardTitle>
          <RadioCardDescription className="text-nowrap">Побеждает оставшийся слот</RadioCardDescription>
        </RadioCard>
      </RadioGroup>
    </Flex>
  )
}

function GameTypeRadioGroup() {
  const game = useStoreSelector(auctionGamesSelectors.getGame)
  const { setGame } = useActionCreators(auctionGamesActions)

  return (
    <Flex direction="column">
      <Title
        className="text-white/80 font-medium font-golos-f mb-2.5"
        order={3}
      >
        Формат
      </Title>
      <RadioGroup
        className="w-full flex flex-col gap-y-2 px-0.5 desktop:gap-x-3 desktop:justify-between desktop:flex-row"
        value={game}
        defaultValue="wheel"
        onValueChange={value => setGame(value as AuctionGames)}
      >
        <RadioCard
          slotsClassnames={{ label: 'w-full grow p-0' }}
          value="wheel"
          icon={<Icons.Wheel className="text-gray-accent" />}
        >
          <RadioCardTitle>Колесо</RadioCardTitle>
          <RadioCardDescription className="text-nowrap">Стандартное колесо фортуны</RadioCardDescription>
        </RadioCard>
        <RadioCard
          slotsClassnames={{ label: 'w-full grow p-0' }}
          value="cards"
          icon={<Icons.Cards className="text-gray-accent" />}
        >
          <RadioCardTitle>
            Карты
            <Badge variant="success" className="ml-2 h-4.5">Beta</Badge>
          </RadioCardTitle>
          <RadioCardDescription className="text-nowrap">Слоты спрятаны под картами</RadioCardDescription>
        </RadioCard>
      </RadioGroup>
    </Flex>
  )
}
