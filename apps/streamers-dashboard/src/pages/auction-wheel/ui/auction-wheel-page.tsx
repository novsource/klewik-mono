import { auctionGamesSelectors } from '~entities/games/store'

import { useDocumentTitle } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Flex } from '~shared/ui/flex'

import { cn } from '~shared/utils'

import { auctionWheelPageStyles } from '../styles'
import { AuctionCardsGame } from './games/cards-auction-game.ui'
import { Wheel } from './games/wheel-of-fortune.ui'
import { WheelTabs } from './tabs/wheel-tabs'

const AuctionWheelPage = () => {
  const auctionGame = useStoreSelector(auctionGamesSelectors.getGame)

  useDocumentTitle('Игра | Поинтовый аукцион Klewik')

  return (
    <div className={cn(auctionWheelPageStyles.pageWrapper)}>
      <Flex className={cn(auctionWheelPageStyles.wheelWrapper)}>
        <div className="flex w-full h-full">
          {auctionGame === 'wheel' && <Wheel />}
          {auctionGame === 'cards' && <AuctionCardsGame />}
        </div>
        <div className={cn(auctionWheelPageStyles.wheelTabsWrapper)}>
          <WheelTabs />
        </div>
      </Flex>
    </div>
  )
}

export default AuctionWheelPage
