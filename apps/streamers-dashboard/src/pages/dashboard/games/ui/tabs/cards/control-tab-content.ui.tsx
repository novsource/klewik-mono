import { useMemo } from 'react'

import { useAuctionGameContext } from '~pages/dashboard/games/context/auction-game-context'
import { useAuctionCardsGame } from '~pages/dashboard/games/hooks/use-auction-cards-game'
import { controlWheelTabStyles } from '~pages/dashboard/games/styles'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

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

  const cardsGame = useAuctionCardsGame()

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
