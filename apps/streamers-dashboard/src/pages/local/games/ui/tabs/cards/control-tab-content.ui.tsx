import { useMemo } from 'react'

import { useCardsGameContext } from '~entities/games/context/cards-game/cards-game.context'

import { controlWheelTabStyles } from '~pages/dashboard/games/styles'
import { useAuctionGameContext } from '~pages/local/games/context/auction-game-context'

import { Button } from 'klewik-ui/button'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'

import { twSlotsStyles } from '~shared/utils'

export const CardsGameControllers = () => {
  const tabsContentStyles = useMemo(() => twSlotsStyles(controlWheelTabStyles), [])

  return (
    <Flex className={tabsContentStyles.controlsWrapper}>
      <ShuffleCardsButton />
    </Flex>
  )
}

function ShuffleCardsButton() {
  const auctionGame = useAuctionGameContext()

  const cardsGame = useCardsGameContext()

  const isDisabled = auctionGame.state.slots.alived.length < 2 || auctionGame.state.slots.winner !== null

  const shuffleCards = () => {
    if (isDisabled)
      return

    cardsGame.actions.shuffleCards()
  }

  return (
    <Button
      className="w-full"
      variant="action"
      size="lg"
      startContent={<Icons.Refresh />}
      disabled={isDisabled}
      onClick={shuffleCards}
    >
      Перетасовать
    </Button>
  )
}
