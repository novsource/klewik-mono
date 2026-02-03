import { CardsGame } from '~entities/games/ui/card-game/cards-game.ui'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { MotionBox } from '~shared/ui/motion-box'

export const AuctionCardsGame = () => {
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  return (
    <CardsGame auctionSlots={auctionSlots}>
      <CardsGame.Field>
        {card => (
          <MotionBox
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: 'spring' }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <CardsGame.Card key={card.id} cardUnit={card} />
          </MotionBox>
        )}
      </CardsGame.Field>
    </CardsGame>
  )
}
