import { useMemo } from 'react'

import { useAuctionCardsGame } from '~pages/dashboard/games/hooks/use-auction-cards-game'
import { controlWheelTabStyles } from '~pages/dashboard/games/styles'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

import { twSlotsStyles } from '~shared/utils'

export const CardsGameControllers = () => {
  const tabsContentStyles = useMemo(() => twSlotsStyles(controlWheelTabStyles), [])

  const { state, actions } = useAuctionCardsGame()

  const isDisabled = state.cardsUnits.length === 0

  const handleOnClick = () => {
    if (isDisabled)
      return

    actions.shuffleCards()
  }

  return (
    <Flex className={tabsContentStyles.controlsWrapper}>
      <Button
        className="w-full"
        variant="action"
        size="lg"
        startContent={<Icons.Refresh />}
        disabled={isDisabled}
        onClick={handleOnClick}
      >
        Перетасовать
      </Button>
    </Flex>
  )
}
