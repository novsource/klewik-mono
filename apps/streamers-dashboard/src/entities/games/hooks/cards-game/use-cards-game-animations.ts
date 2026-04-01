import type { TargetResolver, Variant } from 'motion'

import type { UseCardsGameLayoutReturnValue } from './use-cards-game-layout'

import { useMemo } from 'react'

import { useCardsGameContext } from '~entities/games/context/cards-game/cards-game.context'

import { useIsFirstRender, usePrevious } from '~shared/hooks'

type ChoosedAnimationVariantsArgs = {
  coords: {
    x: number
    y: number
  }
}

type CardsAnimationsVariant = 'choose' | 'initial' | 'open' | 'reveal' | 'swipeToCenter' | 'swipeFromCenter'

const cardsAnimationVariants: Record<CardsAnimationsVariant, Variant> = {
  initial: { position: 'relative', opacity: 0, scale: 0.75, clipPath: `rect(0% 100% 100% 0%)` },
  open: { opacity: 1, scale: 1, x: 0, y: 0, transition: { duration: 1, type: 'spring' }, clipPath: `rect(0% 100% 100% 0%)` },
  choose: (args: ChoosedAnimationVariantsArgs) => ({
    zIndex: 104,
    opacity: 1,
    scale: 1.6,
    x: args.coords.x,
    y: args.coords.y,
    transition: { duration: 1, type: 'spring' },
  }),
  reveal: (args: ChoosedAnimationVariantsArgs) => ({
    zIndex: 104,
    opacity: 1,
    scale: 1.6,
    x: args.coords.x,
    y: args.coords.y,
    clipPath: `rect(100% 100% 100% 0%)`,
    transition: { duration: 4.5 },
  }),
  swipeToCenter: (args: ChoosedAnimationVariantsArgs & { direction: 'right' | 'left' }) => ({
    zIndex: 104,
    opacity: [0, 1],
    scale: [1.6, 1.6],
    x: [args.direction === 'right' ? args.coords.x - 400 : args.coords.x + 400, args.coords.x],
    y: [args.coords.y, args.coords.y],
    animationDelay: [0, 1],
    transition: { duration: 0.75, type: 'spring' },
  }),
  swipeFromCenter: (args: ChoosedAnimationVariantsArgs & { direction: 'right' | 'left' }) => ({
    zIndex: [104, 10],
    scale: [1.6, 1.6, 1],
    opacity: [1, 0, 1],
    x: [args.coords.x, args.direction === 'right' ? args.coords.x + 400 : args.coords.x - 400, 0],
    y: [args.coords.y, args.coords.y, 0],
    animationDelay: [0, 1, 0],
    transition: { duration: 0.75 },
  }),
} as const

type CardsVariantsCollectionItem = {
  animate: CardsAnimationsVariant
  custom?: {
    [K in CardsVariantsCollectionItem['animate']]: typeof cardsAnimationVariants[K] extends (...args: unknown[]) => Variant ? Parameters<typeof cardsAnimationVariants[K]> : never
  }[CardsVariantsCollectionItem['animate']]
}

export const useCardsGameAnimations = (layoutInfo: UseCardsGameLayoutReturnValue['cardsLayoutInfo']) => {
  const cardsGame = useCardsGameContext()

  const previousChoosedCard = usePrevious(cardsGame.state.choosedCardUnit)

  const isFirstRender = useIsFirstRender()

  const cardsVariants = useMemo(() => {
    const cards = cardsGame.state.cardsUnits
    const choosedCard = cardsGame.state.choosedCardUnit
    const confirmedCard = cardsGame.state.confirmedCard

    const cardsVariantsCollection = new Map<number, CardsVariantsCollectionItem>()

    cards.forEach((card) => {
      let variant: CardsAnimationsVariant = !isFirstRender ? 'open' : 'initial'
      let custom: Parameters<TargetResolver>[0] = {}

      const cardLayoutInfo = layoutInfo.get(card.id)

      if (!cardLayoutInfo)
        return

      const isCurrentCardChoosed = card.id === choosedCard?.id
      const isCurrentCardConfirmed = card.id === confirmedCard?.id

      const isShouldSwipeFromCenter = !isCurrentCardChoosed && previousChoosedCard?.id === card.id && choosedCard !== null
      const isShouldSwipeToCenter = isCurrentCardChoosed && previousChoosedCard !== null

      const chooseX = (document.body.offsetWidth / 2) - cardLayoutInfo.initialCoords.x - cardLayoutInfo.width / 2
      const chooseY = (document.body.offsetHeight / 2) - cardLayoutInfo.initialCoords.y - cardLayoutInfo.height / 2

      if (isCurrentCardChoosed) {
        variant = 'choose'
        custom = { coords: { x: chooseX, y: chooseY } }
      }

      if (isShouldSwipeFromCenter) {
        const direction = (previousChoosedCard.id - card.id) < 0 ? 'left' : 'right'

        variant = 'swipeFromCenter'
        custom = { coords: { x: chooseX, y: chooseY }, direction }
      }

      if (isShouldSwipeToCenter) {
        const direction = (previousChoosedCard!.id - card.id) < 0 ? 'left' : 'right'

        variant = 'swipeToCenter'
        custom = { coords: { x: chooseX, y: chooseY }, direction }
      }

      if (isCurrentCardChoosed && isCurrentCardConfirmed) {
        variant = 'reveal'
      }

      cardsVariantsCollection.set(card.id, {
        animate: variant,
        custom,
      })
    })

    return cardsVariantsCollection
  }, [cardsGame.state, isFirstRender, previousChoosedCard, layoutInfo])

  const getCardAnimationVariant = (cardId: number) => cardsVariants.get(cardId)

  return { animationVariants: cardsAnimationVariants, getCardAnimationVariant }
}
