import { useEffect } from 'react'
import type { ReactNode } from 'react'

import { GameContextProvider } from '~entities/games/context/game.context'
import { useCardsGame } from '~entities/games/hooks/cards-game'
import { auctionGamesSelectors } from '~entities/games/store'
import { CardsGame } from '~entities/games/ui/card-game/cards-game.ui'

import type { AuctionSlot } from '~entities/auction-slot/model'

import { WheelGameContextProvider } from '~entities/wheel/context'
import { useWheel } from '~entities/wheel/hooks'

import { useDocumentTitle } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { AuctionCardsGame } from './games/cards-auction-game.ui'
import { WheelGame } from './games/wheel-of-fortune.ui'

export type AuctionGameProps = {
  children: ReactNode
  auctionSlots: AuctionSlot[]
}

export const AuctionGame = (props: AuctionGameProps) => {
  const { children, auctionSlots } = props

  const auctionGame = useStoreSelector(auctionGamesSelectors.getGame)
  const gameMode = useStoreSelector(auctionGamesSelectors.getGameMode)
  const wheelGameSettings = useStoreSelector(auctionGamesSelectors.getWheelGameSettings)

  const cardsGame = useCardsGame(auctionSlots)
  const wheelGame = useWheel(auctionSlots, {
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
    <GameContextProvider>
      {auctionGame === 'wheel' && (
        <WheelGameContextProvider {...wheelGame}>
          <div className="flex w-full h-full">
            <WheelGame />
          </div>
          {children}
        </WheelGameContextProvider>
      )}

      {auctionGame === 'cards' && (
        <CardsGame game={cardsGame}>
          <div className="flex w-full h-full">
            <AuctionCardsGame />
          </div>
          {children}
        </CardsGame>
      )}
    </GameContextProvider>
  )
}
