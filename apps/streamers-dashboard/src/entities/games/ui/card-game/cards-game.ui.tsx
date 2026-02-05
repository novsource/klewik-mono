import type { UseCardsAuctionGameReturnValue } from '~entities/games/hooks/cards-game'
import type { CardsGameUnit } from '~entities/games/model/cards-game'

import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { CardsGameContextProvider, useCardsGameContext } from '~entities/games/context/cards-game/cards-game.context'
import { transform } from 'motion'

import { MotionBox } from '~shared/ui/motion-box'

import { cn, isFunction, mergeProps } from '~shared/utils'

export type CardsGameProps = {
  game: UseCardsAuctionGameReturnValue
  children: ReactNode
}

export const CardsGame = (props: CardsGameProps) => {
  const { game, ...restProps } = props

  return (
    <CardsGameContextProvider cardGame={game} {...restProps} />
  )
}

CardsGame.Field = CardsGameField
CardsGame.Card = GameCard
CardsGame.Backdrop = GameBackdrop
CardsGame.Portal = GameBackdropPortal

export type CardsGameFieldProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  selectedCard?: CardsGameUnit
  children?: (card: CardsGameUnit, index: number) => ReactNode
}

function CardsGameField(props: CardsGameFieldProps) {
  const { className, selectedCard, children, ...restProps } = props

  const { state, actions } = useCardsGameContext()

  const usedSelectedCard = selectedCard ?? state.choosedCardUnit

  const [potentialCardToChoose, setPotentialCardToChoose] = useState<NullablePossible<CardsGameUnit>>(null)
  const [isCardAnimationEnded, setIsCardAnimationEnded] = useState(false)

  const gameFieldElementRef = useRef<HTMLDivElement>(null)

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
          onTransitionEnd={() => setIsCardAnimationEnded(true)}
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
      ref={gameFieldElementRef}
      className={cn('grid grid-cols-6 grid-rows-5 gap-1.5 w-full h-full flex-wrap', className)}
      {...restProps}
    >
      {state.cardsUnits.map(renderCard)}
    </div>
  )
}

type GameBackdropPortalProps = {
  children: ReactNode
}

function GameBackdropPortal(props: GameBackdropPortalProps) {
  if (!props.children)
    return null

  return createPortal(props.children, document.body)
}

type GameBackdropProps = ComponentPropsWithoutRef<'div'>

function GameBackdrop(props: GameBackdropProps) {
  const { className, ...restProps } = props

  return (
    <div
      className={cn('fixed w-full h-full top-0 left-0 bg-black opacity-85 z-[100] select-none', className)}
      {...restProps}
    />
  )
}

type GameCardProps = ComponentPropsWithoutRef<'div'> & {
  cardUnit: CardsGameUnit
  disableAnimation?: boolean
}

function GameCard(props: GameCardProps) {
  const {
    className,
    cardUnit,
    disableAnimation = false,
    children,
    ...restProps
  } = props

  const [rotateCoords, setRotateCoords] = useState({ x: 0, y: 0, z: 0 })

  const [isHovered, setIsHovered] = useState(false)

  const cardElementRef = useRef<HTMLDivElement>(null)

  const { state } = useCardsGameContext()

  const isCurrentCardChoosed = state.choosedCardUnit?.id === cardUnit.id

  const handleOnMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const element = cardElementRef.current

    if (!element)
      return

    const { left, top, width, height } = cardElementRef.current.getBoundingClientRect()

    const diffX = event.clientX - left
    const diffY = event.clientY - top

    const targetX = transform(diffY, [0, height], [10, -10])
    const targetY = transform(diffX, [0, width], [-10, 10])
    const targetZ = 0

    const isShouldChangeCoords = targetX !== rotateCoords.x || targetY !== rotateCoords.y || targetZ !== rotateCoords.z

    if (isShouldChangeCoords) {
      setRotateCoords({ x: targetX, y: targetY, z: 0 })
    }

    if (!isHovered) {
      setRotateCoords({ x: 0, y: 0, z: 0 })
    }
  }, [isHovered, rotateCoords, isCurrentCardChoosed])

  const mergedProps = useMemo(() => mergeProps<ComponentPropsWithoutRef<'div'>[]>({
    onMouseMove: handleOnMouseMove,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  }, restProps), [restProps, handleOnMouseMove, cardUnit])

  return (
    <div
      ref={cardElementRef}
      className="relative w-full h-full cursor-pointer p-1.5 perspective-normal"
      {...mergedProps}
    >
      <div
        className={cn([
          'flex w-full h-full justify-center items-center bg-dark rounded-medium border-1 transition-colors',
          'data-[candidate=true]:border-green-accent data-[candidate=true]:bg-green-dark data-[candidate=true]:animate-pulse',
        ], !isHovered && 'border-dark-light transition-all', isHovered && 'data-[hovered=true]:border-gray', className)}
        data-hovered={isHovered}
        data-choosed={isCurrentCardChoosed}
        style={{
          transform: isHovered && !disableAnimation ? `rotateX(${rotateCoords.x}deg) rotateY(${rotateCoords.y}deg) rotateZ(${rotateCoords.z})` : 'none',
        }}
      >
        {children}
      </div>
    </div>
  )
}
