import { useMemo } from 'react'

import { useAuctionCardsGame } from '~pages/dashboard/games/hooks/use-auction-cards-game'
import { controlWheelTabStyles } from '~pages/dashboard/games/styles'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

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
  const cardsGame = useAuctionCardsGame()
  const alivedSlots = useStoreSelector(auctionSlotsSelectors.getAlivedSlots)

  const isDisabled = alivedSlots.length < 2

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
