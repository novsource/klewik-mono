import { useEffect } from 'react'
import type { ReactNode } from 'react'

import { useCardsGame } from '~entities/games/hooks/cards-game'
import { auctionGamesSelectors } from '~entities/games/store'
import { CardsGame } from '~entities/games/ui/card-game/cards-game.ui'

import { WheelGameContextProvider } from '~entities/wheel/context'
import { useWheel } from '~entities/wheel/hooks'

import { useDocumentTitle } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { useAuctionGameContext } from '../context/auction-game-context'
import { AuctionCardsGame } from './games/cards-auction-game.ui'
import { WheelGame } from './games/wheel-of-fortune.ui'

export type AuctionGameProps = {
  children: ReactNode
}

export const AuctionGame = (props: AuctionGameProps) => {
  const { children } = props

  const auctionGameContext = useAuctionGameContext()

  const auctionGame = useStoreSelector(auctionGamesSelectors.getGame)
  const gameMode = useStoreSelector(auctionGamesSelectors.getGameMode)
  const wheelGameSettings = useStoreSelector(auctionGamesSelectors.getWheelGameSettings)

  const cardsGame = useCardsGame(auctionGameContext.state.slots.alived)
  const wheelGame = useWheel(auctionGameContext.state.slots.alived, {
    sizeMode: wheelGameSettings.slicesDisplayMode,
    mode: gameMode,
  })

  const { set: setDocumentTitle } = useDocumentTitle(auctionGame === 'cards'
    ? 'Карты | Поинтовый аукцион Klewik'
    : 'Колесо | Поинтовый аукцион Klewik')

  useEffect(() => {
    const gamePageTitle
      = auctionGame === 'cards'
        ? 'Карты | Поинтовый аукцион Klewik'
        : 'Колесо | Поинтовый аукцион Klewik'

    setDocumentTitle(gamePageTitle)
  }, [auctionGame, setDocumentTitle])

  return (
    <>
      {auctionGame === 'wheel' && (
        <WheelGameContextProvider {...wheelGame}>
          <div className="w-full h-full flex-[7]">
            <WheelGame />
          </div>
          <div className="h-full w-full flex-[3] ">
            {children}
          </div>
        </WheelGameContextProvider>
      )}

      {auctionGame === 'cards' && (
        <CardsGame game={cardsGame}>
          <div className="w-full h-full flex-[7]">
            <AuctionCardsGame />
          </div>
          <div className="h-full w-full flex-[3] ">
            {children}
          </div>
        </CardsGame>
      )}
    </>
  )
}
