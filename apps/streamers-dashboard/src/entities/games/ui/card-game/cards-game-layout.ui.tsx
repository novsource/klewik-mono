import type { CardsGameUnit } from '~entities/games/model/cards-game'

import type { ComponentProps, ReactNode } from 'react'
import { useRef, useState } from 'react'

import { useCardsGameContext } from '~entities/games/context/cards-game/cards-game.context'

import { useMergedRefs } from '~shared/hooks'

import { MotionBox } from 'klewik-ui/motion-box'

import { isFunction } from '~shared/utils'
import { cn } from '~shared/utils/react'

import { GameCard } from './cards-game-item.ui'

export type CardsGameFieldProps = Omit<ComponentProps<'div'>, 'children'> & {
  selectedCard?: CardsGameUnit
  children?: (card: CardsGameUnit, index: number) => ReactNode
}

export const CardsGameLayout = (props: CardsGameFieldProps) => {
  const { className, selectedCard, children, ...restProps } = props

  const { state, actions } = useCardsGameContext()

  const usedSelectedCard = selectedCard ?? state.choosedCardUnit

  const [potentialCardToChoose, setPotentialCardToChoose] = useState<NullablePossible<CardsGameUnit>>(null)

  const gameFieldElementRef = useRef<HTMLDivElement>(null)
  const mergedFieldRef = useMergedRefs(gameFieldElementRef)

  const renderCard = (card: CardsGameUnit, index: number) => {
    if (isFunction(children)) {
      return children(card, index)
    }

    const isCurrentCardChoosed = usedSelectedCard?.id === card.id
    const isCurrentCardCandidate = potentialCardToChoose?.id === card.id

    const fieldColumnsCount = 6
    const fieldRowsCount = 5

    const fieldWidth = gameFieldElementRef.current?.clientWidth || 0
    const fieldHeight = gameFieldElementRef.current?.clientHeight || 0

    index = index > fieldColumnsCount ? index - 1 : index

    const posInColumn = index - (Math.floor(index / fieldColumnsCount) * fieldRowsCount)
    const posInRow = Math.floor(index / fieldColumnsCount)

    const cardWidth = fieldWidth / fieldColumnsCount
    const cardHeight = fieldHeight / fieldRowsCount

    if (isCurrentCardChoosed) {
      const initialX = posInColumn * cardWidth
      const initialY = posInRow * cardHeight

      const targetX = (document.body.clientWidth / 2) - cardWidth
      const targetY = (document.body.clientHeight / 2) - cardHeight

      return (
        <MotionBox
          key={card.id}
          className="fixed z-[101]"
          initial={{ x: initialX, y: initialY, opacity: 1 }}
          animate={{ x: targetX, y: targetY, opacity: 0 }}
          transition={{ duration: 1.5 }}
          style={{
            width: cardWidth,
            height: cardHeight,
          }}
        >
          <GameCard
            className="w-full h-full"
            cardUnit={card}
          />
        </MotionBox>
      )
    }

    return (
      <div key={card.id} className="relative">
        <GameCard
          cardUnit={card}
          onClick={() => {
            if (isCurrentCardCandidate) {
              actions.chooseCard(card)
              setPotentialCardToChoose(null)
            }
            else {
              setPotentialCardToChoose(card)
            }
          }}
        />
      </div>
    )
  }

  return (
    <div
      ref={mergedFieldRef}
      className={cn('grid grid-cols-6 grid-rows-5 gap-1.5 w-full h-full flex-wrap', className)}
      {...restProps}
    >
      {state.cardsUnits.map(renderCard)}
    </div>
  )
}
