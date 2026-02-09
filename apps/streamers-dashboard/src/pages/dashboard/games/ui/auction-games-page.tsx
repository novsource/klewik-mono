import type { ReactNode } from 'react'

import { GameContextProvider } from '~entities/games/context/game.context'
import { useCardsGame } from '~entities/games/hooks/cards-game'
import { auctionGamesSelectors } from '~entities/games/store'
import { CardsGame } from '~entities/games/ui/card-game/cards-game.ui'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { WheelGameContextProvider } from '~entities/wheel/context'
import { useWheel } from '~entities/wheel/hooks'

import { useDocumentTitle } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Flex } from '~shared/ui/flex'

import { cn } from '~shared/utils'

import { auctionWheelPageStyles } from '../styles'
import { AuctionCardsGame } from './games/cards-auction-game.ui'
import { WheelGame } from './games/wheel-of-fortune.ui'
import { GameTabs } from './tabs/game-tabs.ui'

const AuctionGamesPage = () => {
  const auctionGame = useStoreSelector(auctionGamesSelectors.getGame)
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  useDocumentTitle('Игра | Поинтовый аукцион Klewik')

  return (
    <div className={cn(auctionWheelPageStyles.pageWrapper)}>
      <Flex className={cn(auctionWheelPageStyles.wheelWrapper)}>
        {/* <CardsGame game={cardsGame}>
          <div className="flex w-full h-full">
            {auctionGame === 'wheel' && <Wheel />}
            {auctionGame === 'cards' && <AuctionCardsGame />}
          </div>
          <div className={cn(auctionWheelPageStyles.wheelTabsWrapper)}>
            <GameTabs />
          </div>
        </CardsGame> */}
        <AuctionGame auctionSlots={auctionSlots}>
          <div className="flex w-full h-full">
            {auctionGame === 'wheel' && <WheelGame />}
            {auctionGame === 'cards' && <AuctionCardsGame />}
          </div>
          <div className={cn(auctionWheelPageStyles.wheelTabsWrapper)}>
            <GameTabs />
          </div>
        </AuctionGame>
      </Flex>
    </div>
  )
}

type AuctionGameProps = {
  children: ReactNode
  auctionSlots: AuctionSlot[]
}

function AuctionGame(props: AuctionGameProps) {
  const { children, auctionSlots } = props

  const auctionGame = useStoreSelector(auctionGamesSelectors.getGame)

  const cardsGame = useCardsGame(auctionSlots)
  const wheelGame = useWheel(auctionSlots)

  return (
    <GameContextProvider>
      {auctionGame === 'wheel' && (
        <WheelGameContextProvider {...wheelGame}>
          {children}
        </WheelGameContextProvider>
      )}

      {auctionGame === 'cards' && (
        <CardsGame game={cardsGame}>
          {children}
        </CardsGame>
      )}
    </GameContextProvider>
  )
}

export default AuctionGamesPage
