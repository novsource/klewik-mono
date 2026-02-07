import { useCardsAuctionGame } from '~entities/games/hooks/cards-game'
import { auctionGamesSelectors } from '~entities/games/store'
import { CardsGame } from '~entities/games/ui/card-game/cards-game.ui'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useDocumentTitle } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Flex } from '~shared/ui/flex'

import { cn } from '~shared/utils'

import { auctionWheelPageStyles } from '../styles'
import { AuctionCardsGame } from './games/cards-auction-game.ui'
import { Wheel } from './games/wheel-of-fortune.ui'
import { GameTabs } from './tabs/wheel-tabs/wheel-tabs'

const AuctionWheelPage = () => {
  const auctionGame = useStoreSelector(auctionGamesSelectors.getGame)
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  useDocumentTitle('Игра | Поинтовый аукцион Klewik')

  const cardsGame = useCardsAuctionGame(auctionSlots)

  return (
    <div className={cn(auctionWheelPageStyles.pageWrapper)}>
      <Flex className={cn(auctionWheelPageStyles.wheelWrapper)}>
        <CardsGame game={cardsGame}>
          <div className="flex w-full h-full">
            {auctionGame === 'wheel' && <Wheel />}
            {auctionGame === 'cards' && <AuctionCardsGame />}
          </div>
          <div className={cn(auctionWheelPageStyles.wheelTabsWrapper)}>
            <GameTabs />
          </div>
        </CardsGame>
      </Flex>
    </div>
  )
}

export default AuctionWheelPage
