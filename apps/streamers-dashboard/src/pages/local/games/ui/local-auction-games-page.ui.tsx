import { Flex } from 'klewik-ui/flex'

import { cn } from '~shared/utils/react'

import { AuctionGameContextProvider } from '../context/auction-game-context'
import { auctionWheelPageStyles } from '../styles'
import { LocalAuctionGame } from './games/local-auction-game.ui'
import { GameTabs } from './tabs/game-tabs.ui'

export const LocalAuctionGamesPage = () => {
  return (
    <div className={cn(auctionWheelPageStyles.pageWrapper)}>
      <div className="flex w-full h-full px-6 gap-x-6">
        <Flex className={cn(auctionWheelPageStyles.wheelWrapper)}>

          <AuctionGameContextProvider>
            <LocalAuctionGame>
              <div className={cn(auctionWheelPageStyles.wheelTabsWrapper)}>
                <GameTabs />
              </div>
            </LocalAuctionGame>
          </AuctionGameContextProvider>

        </Flex>
      </div>
    </div>
  )
}
