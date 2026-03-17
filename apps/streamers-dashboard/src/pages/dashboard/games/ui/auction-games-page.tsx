import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Flex } from '~shared/ui/flex'

import { cn } from '~shared/utils'

import { AuctionGameContextProvider } from '../context/auction-game-context'
import { auctionWheelPageStyles } from '../styles'
import { AuctionGame } from './auction-game.ui'
import { GameTabs } from './tabs/game-tabs.ui'

export const AuctionGamesPage = () => {
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  return (
    <div className={cn(auctionWheelPageStyles.pageWrapper)}>
      <Flex className={cn(auctionWheelPageStyles.wheelWrapper)}>

        <AuctionGameContextProvider>
          <AuctionGame auctionSlots={auctionSlots}>
            <div className={cn(auctionWheelPageStyles.wheelTabsWrapper)}>
              <GameTabs />
            </div>
          </AuctionGame>
        </AuctionGameContextProvider>

      </Flex>
    </div>
  )
}
